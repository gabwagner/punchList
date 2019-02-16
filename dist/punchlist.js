;(function ( $, window, document, undefined ) {
  var punchList = 'defaultPunchList',
    defaults = {
      title: "Punch List",
      apiCall: null,
      punchListContainerTemplate: ({ title }) => `<div class="punchlist-title">
        <h1><i class="fa fa-check"></i>${title}</h1>
      </div>
      <div id="punchlist-items-container">
        <div id="punchlist-items">          
        </div>
        <div id="add-item">
          <i class="fa fa-plus"></i>
          Add an Item
        </div>        
      </div>`,
      punchListDataTemplate: (data) =>  `"${data.name}":"${data.value}"`,      
      punchListCommentTagsTemplate: (tag) =>  `<b>${tag.title}</b>: ${tag.value}`,
      punchListCommentTemplate: (comment) =>  `<div class="punchlist-comment">
          <div class="punchlist-comment-text">${comment.comment}</div>
          <div class="punchlist-comment-tag">${comment.tags.map(defaults.punchListCommentTagsTemplate).join(' - ')} ${comment.deletable ? '<i class="fa fa-times-circle comment-action"></i>':''}</div>
      </div>`,
      punchListItemTagsTemplate: (tag) =>  `<div class="punchlist-item-tag"><b>${tag.title}</b>: ${tag.value}</div>`,
      punchListItemTemplate: (item, index) =>  `<div id="item-${index}" data-item='{${item.data.map(defaults.punchListDataTemplate).join(',')}}'>
        <div class="punchlist-item">
          <div class="punchlist-item-label">
            <input type="checkbox" id="punch-item-${index}" ${item.checked ? 'checked': ''}/>
            <label for="punch-item-${index}" class="punchlist-item-label-text" title="${item.item}">
              <i class="fa fa-check"></i> 
              <span class="punchlist-item-label-text-line">
                <span class="punchlist-item-label-text-data">${item.item}</span>
              </span>
            </label>
          </div>
          <div class="punchlist-item-action" title="comments">
            <i class="fa fa-comment"></i>
          </div>
          <div class="punchlist-item-action" title="remove">
            <i class="fa fa-times-circle"></i>
          </div>
        </div>
        <div class="punchlist-item-tags">
          ${item.tags.map(defaults.punchListItemTagsTemplate).join('')}
        </div>
        <div class="punchlist-comments hidden">
           ${item.comments.map(defaults.punchListCommentTemplate).join('')}
        </div>
        <div class="add-item-comment">
          <i class="fa fa-plus"></i>
          Add Comment
        </div>
      </div>`,
    };
  // Punch List Constructor
  // Override default with provided options
  function PunchList( element, options ) {    
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = punchList;
    // Index is used to provide unique id to new items
    this._index = 0;
    this.init();
  }          
  // Initilize function
  // If api call is set, add the provide items from the api call to the list.
  PunchList.prototype.init = function() {
    var htmlPunchListContainer = [{title: this.options.title}].map(this.options.punchListContainerTemplate).join('');
    $(this.element).html(htmlPunchListContainer);
    $(this.element).addClass('punchlist-container');
    var self = this;
    if(this.options.fillDataCall) {
      $.getJSON(this.options.fillDataCall, function(items) { 
        self._index = items.length;
        self.drawItems(self.standardizeData(items));
      });
    }
    /* Adding Add Behaviour */
    $('#add-item').click(function(){ self.addItem() }); 
  }
  // Transform Data to Punch List Data
  PunchList.prototype.standardizeData = function(data) {
    var result = [];
    var self = this;
    if(this.options.fillDataTransform) {
      var transform = this.options.fillDataTransform;
      $.map(data, function(item) {
        var newItem = {};
        newItem.item = item[transform.item];
        newItem.checked =  item[transform.checked];
        newItem.comments = [];
        newItem.tags = [];
        newItem.data = [];
        if(transform.data) {
          $.map(transform.data, function(data) {
            var newData = {};
            newData.name = data.name;
            newData.value = item[data.field];
            newItem.data.push(newData);
          });
        }
        if(transform.tags) {
          $.map(transform.tags, function(tag) {
            var newTag = self.standardizeTag(item, tag);
            newItem.tags.push(newTag);
          });
        }
        if(transform.comments) {
          $.map(item[transform.comments.listField], function(comment) {
            var newComment = {};
            newComment.comment = comment[transform.comments.field];
            newComment.deletable = transform.comments.deletable;
            newComment.tags = [];

            if(transform.comments.tags) {
              $.map(transform.comments.tags, function(tag) {
 
                var newTag = self.standardizeTag(comment, tag);

                newComment.tags.push(newTag);
              });                
            }
            newItem.comments.push(newComment);
          });
        }
        result.push(newItem);
      });
    } else {
        if(!this.validateData(data)) {
          console.log("Invalid Data Receive from api call " + this.options.fillDataCall);
        } else {
          result = data;
        }
    }   
    return result;
  }
  // Function to standarize tag
  PunchList.prototype.standardizeTag = function(item, tag) {
    var newTag = {};
    newTag.title = tag.title;
    switch(tag.convert) {
      case "date":
        newTag.value = new Date(item[tag.field]).toLocaleString();
        break;
      default:
        newTag.value = item[tag.field];
        break;
    } 
    return newTag;   
  }
  // Draw a list of item provided from the api call
  PunchList.prototype.drawItems = function(items) {
    var htmlPunchListContainer = items.map(this.options.punchListItemTemplate).join('');
    var punchlist_items = $(this.element).find('#punchlist-items');
    punchlist_items.html(htmlPunchListContainer);    
    /* Adding Behaviour */
    this.setItemFunctionality($(this.element));
  }
  // Set the behaviour for the new item. 
  // Behaviours: 
  //  Remove Item
  //  Expand Comments
  //  Add Comment
  PunchList.prototype.setItemFunctionality = function(item) {
    var self = this;
    
    item.find('.fa-times-circle').click( function(){
        var parentItem = $(this).parent().parent().parent();
        if(self.options.removeItemHandler) {
            if(self.options.removeItemHandler(parentItem.attr('id'), parentItem.data('item'))) {
              self.removeItem(parentItem);
            } else {
              console.warn("Item could not be removed - check handler removeItemHandler");
            }
        } else {
          self.removeItem(parentItem);
        }
    });
    
    item.find('.fa-comment').click(function(){
      var parentItem = $(this).parent().parent().parent();
      $(parentItem).find('.punchlist-comments').toggleClass('hidden');
    });
    
    item.find('.add-item-comment').click(function(){
      self.addComment($(this).parent());
    });    
    
    item.find('input[type=checkbox]').change(function() {
        if(self.options.checkedItemHandler) {
            var parentItem = $(this).parent().parent().parent();
            if(!self.options.checkedItemHandler(parentItem.attr('id'), parentItem.data('item'), $(this).prop("checked"))) {
              console.warn("Item could not change state - check handler checkedItemHandler");
              $(this).prop("checked", !$(this).prop("checked"));
            }
        }
    });
  }
  // Add new comment. If not comment is set the comment is removed automaticallly
  // New comments will have the remove functionallity
  PunchList.prototype.addComment = function(item) {
    var comments = item.find('.punchlist-comments');
    var newComment = {comment:'', deletable:true, tags:[]};
    var now = (new Date()).toLocaleString();
    newComment.tags.push({title:'User',value:'Me'});
    newComment.tags.push({title:'Date',value:now});
    var new_comment_html = $.map([newComment],this.options.punchListCommentTemplate).join('');
    var newItem = $(new_comment_html).prependTo(comments);
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'punch-item-comment';
    input.style.width = "100%";
    var toAppendInput = newItem.find('.punchlist-comment-text');
    var input = $(input).appendTo(toAppendInput);
    input.focus();    
    var self = this;
    input.enterKey(function(){
      $(this).trigger('enterEvent');
    });
    input.on('blur enterEvent',function(){
      var itemComment = input.val();
      var itemCommentLength = itemComment.length;
      if (itemCommentLength > 0) {
        // TODO: Add new item comment handler
        $(this).parent().html(itemComment);
        newItem.find('.fa-times-circle').click( function(){
            newItem.remove();
        });        
      } else {
        newItem.remove();
      }
    });    
  }
  // Add new punch list item. If not title is set the new item is removed automatically
  PunchList.prototype.addItem = function() {
    this._adding = true;
    this._index++;
    var punchlist_items = $(this.element).find('#punchlist-items');
    var new_item_html = $.map({ [this._index]:{item:'',comments:[], tags:[], data:[]}},this.options.punchListItemTemplate).join('');
    var newItem = $(new_item_html).appendTo(punchlist_items);
    newItem.find('.punchlist-item-tags').remove();
    var toAppendInput = newItem.find('.punchlist-item-label-text-data');
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'punch-item';
    input.style.width = "100%";
    var input = $(input).appendTo(toAppendInput);
    input.focus();
    var self = this;
    input.enterKey(function(){
      $(this).trigger('enterEvent');
    });
    input.on('blur enterEvent',function(){
      var todoTitle = input.val();
      var todoTitleLength = todoTitle.length;
      if (todoTitleLength > 0) {
        if(self.options.addItemHandler&&!self.options.addItemHandler(newItem.attr('id'), input.val())) {
          console.warn("Item could not be added - check handler addItemHandler");
          newItem.remove();
        } else {
           $(this).parent().html(todoTitle);
          self.setItemFunctionality(newItem);         
        }
      } else {
        newItem.remove();
      }
    });
  }
  // Remove desired dom item with animation
  PunchList.prototype.removeItem = function(element) {
      element.animate({
        left:"-30%",
        height:0,
        opacity:0
        },200);
      setTimeout(function(){
        $(element).remove();             
      }, 1000);
  }
  // Start plugin function
  $.fn.punchList = function ( options ) {
      return new PunchList( this, options );
  }
  // When enter is pressed call function
  $.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    });
  }
})( jQuery, window, document );