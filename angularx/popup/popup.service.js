(function() {
    /* popup.service.js by Amitesh Kumar*/
    angular.module('popup', [])
        .provider('PopupSvc', PopupProviderFunction);

    function PopupProviderFunction() {

        var DEFAULTS = {
            //title, subTitle and body are not a part of configuration
            // title: '', // String (optional). The title of the popup.
            // subTitle: '', // String (optional). The sub-title of the popup. only applicable when title provided
            // body: '', //String or html template to place in the popup body.

            okText: 'OK', //text for OK button
            okClass: 'btn-info', //class(es) to be added to OK button; e.g 'btn-info btn-small'
            cancelText: 'Cancel', //not applicable for alert
            cancelClass: 'btn-secondary',

            headerClass: 'text-center', //class to be added to bootstrap modal-header
            bodyClass: '', //class for bootstrap modal-body
            footerClass: '', //class for bootstrap modal-footer

            //Below are the three uibModal related properties, see uibModal Bootstrap documentation for details

            backdrop: 'static', //Controls presence of a backdrop. Allowed values: true (default), false (no backdrop), 'static' (disables modal closing by click on the backdrop).

            keyboard: false, //Indicates whether the dialog should be closable by hitting the ESC key.
            size: 'sm', //modal or popup size, default is small

            /*NOTE: Below are the app level configuration applicable when input parameter is string. It can be set during angular config phase.
             */

            showStringAs: 'body', //it will display the text as modal body(left aligned smaller font text). Other value is 'title' (center aligned h5 element)
            enableDynamicSize: true, //show medium size popup when input string extends the below character limit
            extendSizeCharLength: 300
        };

        this.setDefaults = function(userDefaults) {
            angular.extend(DEFAULTS, userDefaults);
        };

        this.$get = ["$uibModal", function($uibModal) {
            return new PopupSvc(DEFAULTS, $uibModal);
        }];

    }

    function PopupSvc(DEFAULTS, $uibModal) {
        /* jshint -W043 */
        var POPUP_TEMPLATE = '\
        <div>\
            <div class="modal-header" ng-class="vm.headerClass" ng-if="vm.title" style="border:none; padding-bottom: 0;">\
                <h3 class="modal-title" ng-bind-html="vm.title"></h3>\
                <h5 class="modal-sub-title" ng-bind-html="vm.subTitle" ng-if="vm.subTitle"></h5>\
            </div>\
            <div class="modal-body" ng-if="vm.body" ng-class="vm.bodyClass">\
                <div ng-bind-html="vm.body"></div>\
            </div>\
            <div class="modal-footer" ng-class="vm.footerClass" style="text-align: center; padding-top: 10px; padding-bottom: 15px; border: none">\
                <div xclass="btn-group">\
                    <button ng-repeat="button in vm.buttons" ng-click="vm.onButtonClick(button, $index)" style="min-width: 70px;" class="btn" ng-class="button.className" ng-bind-html="button.text"></button>\
                </div>\
            </div>\
        </div>';

        return {
            alert: _alert,
            confirm: _confirm
            //prompt: _prompt,
            //show: _show//generic one which can show multiple buttons
        };

        function _alert(opts) {
            return _showPopup(extend([{
                text: opts.okText || DEFAULTS.okText,
                className: opts.okClass || DEFAULTS.okClass,
                handler: function() {
                    return true;
                }
            }], opts || {}));
        }

        function _confirm(opts) {
            return _showPopup(extend([{
                text: opts.cancelText || DEFAULTS.cancelText,
                className: opts.cancelClass || DEFAULTS.cancelClass,
                handler: function() {
                    return false;
                }
            }, {
                text: opts.okText || DEFAULTS.okText,
                className: opts.okClass || DEFAULTS.okClass,
                handler: function() {
                    return true;
                }
            }], opts || {}));
        }

        function extend(buttons, userOpts) {
            var options = angular.copy(DEFAULTS);
            userOpts = userOpts || 'You there?';
            if (typeof userOpts === 'string') {
                var obj = {};
                obj[DEFAULTS.showStringAs] = userOpts;
                if (DEFAULTS.enableDynamicSize && userOpts.length > DEFAULTS.extendSizeCharLength) {
                    obj.size = 'md';
                }
                userOpts = obj;
            }
            options.buttons = buttons;
            return angular.extend(options, userOpts);
        }


        function _showPopup(options) {
            var modalInstance = $uibModal.open({
                template: POPUP_TEMPLATE,
                size: options.size,
                backdrop: options.backdrop,
                keyboard: options.keyboard,
                bindToController: true,
                controllerAs: 'vm',
                controller: ['$injector', 'options', ModelController],
                resolve: {
                    options: function() {
                        return options;
                    }
                }
            });

            var obj = modalInstance.result; //returned promise
            obj.close = modalInstance.close; //augment close method

            return obj;
        }

        function ModelController($injector, options) {
            var vm = this;
            sanitizeInput(options);
            angular.extend(vm, options);

            vm.onButtonClick = function(button, $index) {
                var response = button.handler(); //true for alert,  true and false for confirm
                vm.$close(response);
            };

            function sanitizeInput(options) {
                if ($injector.has('$sanitize')) {
                    return; //no need to sanitize
                }

                var $sce = $injector.get('$sce');

                options.title = $sce.trustAsHtml(options.title);
                options.subTitle = $sce.trustAsHtml(options.subTitle);
                options.body = $sce.trustAsHtml(options.body);
                options.buttons.forEach(function(button, index, buttons) {
                    button.text = $sce.trustAsHtml(button.text);
                });
            }
        }
    }
})();