# Angular Bootstrap Popup


A simple and elegant angular service inspired by [ionic popup](http://ionicframework.com/docs/v1/api/service/$ionicPopup) to show popup(or dialogue) window for `alert` and `confirm` with custom content and look.

PopupSvc exposes two methods `alert` and `confirm` which takes one parameter either string/html template or an [option](#advance-usage) object for customized look and feel.
These methods returns [promise](https://docs.angularjs.org/api/ng/service/$q) which is resolved when the popup is dismissed. It also returns `close` method to programmatically close it.


## Dependency

[Angular](https://code.angularjs.org/1.5.3/docs/api) (tested on v1.5.3)

[Angular UI Bootstrap](http://angular-ui.github.io/bootstrap/versioned-docs/1.3.3/) (tested on v1.3.3)

> PopupSvc should work fine with any Angular/UI Bootstrap version supporting [ControllerAs](https://johnpapa.net/angularjss-controller-as-and-the-vm-variable/) syntax.

## Demo

Check out the demo at [Plunker](https://embed.plnkr.co/SNhye1/)


## Usage 

```javascript
angular.module('myApp', ['popup']);//add popup module dependency
angular.controller('myCtrl', ['PopupSvc', function(PopupSvc){//Inject the PopupSvc service into your controller

    //1. Basic Usage
    PopupSvc.alert("<strong>Hey!</strong> How you doing");//html string
    PopupSvc.confirm("Are you sure?");//normal text

    //2. Reacting on popup dismissal/button click
    var popup = PopupSvc.alert("Hey! How you doing");
    popup.then(function(){
        console.log('Alert dismissed');
    });

    PopupSvc.confirm("Hey! How you doing").then(function(response){
        if(response){
            console.log('Primary/OK button clicked');
        }else{
            console.log('Secondary/Cancel button clicked');
        }    
    });

    //Programmatically closing the popup using `close` method
    //close method must be executed in next tick as popup creation is asynchronous
    var popup = PopupSvc.alert("Hey! How you doing");
    window.setTimeout(popup.close, 3000);

    //3. Customized popup
    var popupOption = {//only fewer options here
        title: 'Confirm',
        subTitle: '<span style="color: red;">Are you sure?</span>',
        body: 'Operation can not be reverted',
        okText: 'Delete',
        okClass: 'btn-danger',
        size: 'md'//show a medium size modal popup
    };
    PopupSvc.confirm(popupOption);
}]);

```

## Install

Download the script file directly from Github.

https://raw.githubusercontent.com/amiteshhh/utilities/master/angular/popup/popup.service.min.js

Add `script` reference to your html then add `popup` module as angular module dependency. Now you can use `PopupSvc` service.


## Advance Usage

To have a custom look and feel (e.g button texts etc.) use below option as a parameter to `alert` or `confirm`. All of the option properties are optional. Of course you will provide value for `body` or `title` to render some text.


> popup is created using bootstrap $uibModal hence there are few properties related to that as well

```javascript
{
    title: '', // String. The title of the popup.
    subTitle: '', // String. The sub-title of the popup. only applicable when title provided
    body: '',//String to place in the popup body.

    okText: 'OK',//text for OK button
    okClass: 'btn-info',//class(es) to be added to OK button; e.g 'btn-info btn-small'
    cancelText: 'Cancel',//not applicable for alert
    cancelClass: 'btn-secondary',
    
    headerClass: 'text-center',//class to be added to bootstrap modal-header
    bodyClass: '',//class for bootstrap modal-body
    footerClass: '',//class for bootstrap modal-footer

    //Below are the three uibModal related properties, see uibModal Bootstrap documentation for details

    backdrop: 'static',//Controls presence of a backdrop. Allowed values: true (default), false (no backdrop), 'static' (disables modal closing by click on the backdrop).

    keyboard: false,//Indicates whether the dialog should be closable by hitting the ESC key.
    size: 'sm',//modal or popup size, default is small

    /*NOTE: Below are the app level configuration applicable when input parameter is string. It can be set during angular config phase.
    */

    showStringAs: 'body',//it will display the text as modal body(left aligned smaller font text). Other value is 'title' (center aligned h5 element)
    enableDynamicSize: true,//show medium size popup when input string extends the below character limit
    extendSizeCharLength: 300
};

```

> Sice all applicable string inputs can contains `html` tags therefore you can easily control the style.


## Default Configuration

You can easily configure the default popup option for the application during config phase using `PopupSvcProvider` as below.


```javascript
angular.module('myApp', ['popup'])
    .config(['PopupSvcProvider', function(PopupSvcProvider){
         PopupSvcProvider.setDefaults({
            okText: 'Dismiss',//Now instead of 'OK' popup will show button with text 'Dismiss' 
            okClass: 'btn-primary',
            cancelText: 'Close',
            keyboard: true//popup can be closed now with ESC key.
        });
    }]);
```
However the option parameter will still take precedence over app level configuration.

## License

MIT