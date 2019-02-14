;(function ( $, window, document, undefined ) {
  
  var punchList = 'defaultPunchList',
          defaults = {
              title: "Punch-List",
              apiCall: "json/response.json",
              punchListContainerTemplate: ({ title }) => `<div id="punchlist-title">
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
              punchListCommentTemplate: (comment) =>  `<div class="comment">
                  <div class="comment-text">${comment.comment}</div>
                  <div class="punchlist-comment-tag">User: ${comment.user} - Date:${new Date(comment.datetime).toLocaleString()} ${comment.user == "Me" ? '<i class="fa fa-times-circle comment-action"></i>':''}</div>
              </div>`,
              punchListItemTemplate: (item, index) =>  `<div id="item-${index}">
                <div class="punchlist-item">
                  <div class="punchlist-item-label">
                    <input type="checkbox" id="${index}" ${item.index ? 'checked': ''}/>
                    <label for="${index}" class="punchlist-item-label-text" title="${item.item}">
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
                  <div class="punchlist-item-tag">Company: ${item.company}</div>
                  <div class="punchlist-item-tag">Project: ${item.project}</div>
                  <div class="punchlist-item-tag">User: ${item.user}</div>
                  <div class="punchlist-item-tag">Date: ${new Date(item.datetime).toLocaleString()}</div>
                </div>
                <div class="comments hidden">
                   ${item.comments.map(defaults.punchListCommentTemplate).join('')}
                </div>
                <div class="add-item-comment">
                  <i class="fa fa-plus"></i>
                  Add Comment
                </div>
              </div>
            `,
            };

  function PunchList( element, options ) {    
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = punchList;
    this._index = 0;
    this._adding = false;
    this.init();
  }          

  PunchList.prototype.init = function() {
    var htmlPunchListContainer = [{title: this.options.title}].map(this.options.punchListContainerTemplate).join('');
    $(this.element).html(htmlPunchListContainer);
    // TODO: Exception management for call 
    var self = this;
    $.getJSON(this.options.apiCall, function(items) { 
      self._index = items.length;
      self.drawItems(items);
    });
    /* Adding Add Behaviour */
    $('#add-item').click(function(){ self.addItem() }); 
  }
  
  PunchList.prototype.drawItems = function(items) {
    var htmlPunchListContainer = items.map(this.options.punchListItemTemplate).join('');
    var punchlist_items = $(this.element).find('#punchlist-items');
    punchlist_items.html(htmlPunchListContainer);    
    /* Adding Behaviour */
    this.setItemFunctionality($(this.element));
  }

  PunchList.prototype.setItemFunctionality = function(item) {
    var self = this;
    
    item.find('.fa-times-circle').click( function(){
        var parentItem = $(this).parent().parent().parent();
        self.removeItem(parentItem);
    });
    
    item.find('.fa-comment').click(function(){
      var parentItem = $(this).parent().parent().parent();
      $(parentItem).find('.comments').toggleClass('hidden');
    });
    
    item.find('.add-item-comment').click(function(){
      self.addComment($(this).parent());
    });    
    
  }
  
  PunchList.prototype.addComment = function(item) {
    var comments = item.find('.comments');
    var new_comment_html = $.map([{comment:'', user:'Me', datetime:new Date().toString()}],this.options.punchListCommentTemplate).join('');
    var newItem = $(new_comment_html).prependTo(comments);
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'punch-item-comment';
    input.style.width = "100%";
    var toAppendInput = newItem.find('.comment-text');
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
  
  PunchList.prototype.addItem = function() {
    this._adding = true;
    this._index++;
    var punchlist_items = $(this.element).find('#punchlist-items');
    var new_item_html = $.map({ [this._index]:{index:false, item:'',comments:[]}},this.options.punchListItemTemplate).join('');
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
        // TODO: Add new item handler
        $(this).parent().html(todoTitle);
        self.setItemFunctionality(newItem);
      } else {
        newItem.remove();
      }
    });
  }

  PunchList.prototype.removeItem = function(item) {
      // TODO: Add item remove handler
      item.animate({
        left:"-30%",
        height:0,
        opacity:0
        },200);
      setTimeout(function(){
        $(item).remove();             
      }, 1000);
  }
    
  $.fn.punchList = function ( options ) {
      return new PunchList( this, options );
  }
  
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