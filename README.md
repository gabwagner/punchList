# Punch List 

Simple plugin to organize tasks.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine. 

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

### Usage

1. Include Font Awesome CSS:

	```html
	 <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
	```

2. Include Punch List CSS:

	```html
	 <link rel="stylesheet" href="dist/punchlist.css">
	```


3. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	```
  
4. Include Punch List JS:

	```html
	<script src="dist/punchlist.js"></script>
	```

5. Call the plugin:

	```javascript
	$("#element").punchList(options);
	```
  
  ### Options
  
  Options are used to configure the Punch List.
  Detailed Options to be send:
| Property | Description |
| --- | --- |
| .title | Title of the Punch List |
| .width | Width of the container. If not set, will expand to the size of the parent |
|  .fillDataCall | RestFULL API CALL. Response must be JSON |
|  .fillDataTransform | JSON mapping to convert to standarize items. In case that .fillDataCall was used |
|  .addItemHandler | Handler to be called one a item is added / addItemHandler(itemId, val) / itemId: is the unique id that can be used to return the dom of the object / val: is the task value the new item will have |
|  .removeItemHandler | Handler to be called when an item is removed / removeItemHandler(itemId, itemData) / itemId: is the unique id that can be used to return the dom of the object / itemData: is the 'item' data $(#itemId).data('item') |
|  .checkedItemHandler| Handler to be called when an item change is status / checkedItemHandler(itemId, itemData, checked) / itemId: is the unique id that can be used to return the dom of the object  / itemData: is the 'item' data $(#itemId).data('item') / checked: boolean. It tells if the item has been checked or unchecked |
  
```javascript
var options = {
  width: 600,
  fillDataCall: "json/response.json",
  fillDataTransform: jsonTransform,
  addItemHandler: onAdd,
  removeItemHandler: onDelete,
  checkedItemHandler: onChecked
};
```
  
## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details
