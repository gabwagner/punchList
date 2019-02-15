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
  ```
  options = {
  title: Title of the punch list,
  apiCall: Call that is being made to obtain tasks and comments
  }
  ```
  
## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details
