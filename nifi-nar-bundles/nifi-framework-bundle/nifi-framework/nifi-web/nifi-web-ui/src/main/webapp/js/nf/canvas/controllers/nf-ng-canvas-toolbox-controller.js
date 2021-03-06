/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global nf, d3 */

nf.ng.Canvas.ToolboxCtrl = function (processorComponent,
                                     inputPortComponent,
                                     outputPortComponent,
                                     groupComponent,
                                     remoteGroupComponent,
                                     funnelComponent,
                                     templateComponent,
                                     labelComponent) {
    'use strict';

    function ToolboxCtrl(processorComponent,
                         inputPortComponent,
                         outputPortComponent,
                         groupComponent,
                         remoteGroupComponent,
                         funnelComponent,
                         templateComponent,
                         labelComponent) {
        this.processorComponent = processorComponent;
        this.inputPortComponent = inputPortComponent;
        this.outputPortComponent = outputPortComponent;
        this.groupComponent = groupComponent;
        this.remoteGroupComponent = remoteGroupComponent;
        this.funnelComponent = funnelComponent;
        this.templateComponent = templateComponent;
        this.labelComponent = labelComponent;

        /**
         * Config for the toolbox
         */
        this.config = {
            type: {
                processor: 'Processor',
                inputPort: 'Input Port',
                outputPort: 'Output Port',
                processGroup: 'Process Group',
                remoteProcessGroup: 'Remote Process Group',
                connection: 'Connection',
                funnel: 'Funnel',
                template: 'Template',
                label: 'Label'
            },
            styles: {
                filterList: 'filter-list'
            },
            urls: {
                api: '../nifi-api',
                controller: '../nifi-api/controller',
                processorTypes: '../nifi-api/flow/processor-types'
            }
        };
    }
    ToolboxCtrl.prototype = {
        constructor: ToolboxCtrl,

        /**
         * Initialize the toolbox controller.
         */
        init: function() {
            // initialize modal dialogs
            processorComponent.modal.init();
            inputPortComponent.modal.init();
            outputPortComponent.modal.init();
            groupComponent.modal.init();
            remoteGroupComponent.modal.init();
            templateComponent.modal.init();
        },

        /**
         * Gets the draggable configuration for a toolbox component.
         *
         * @param {object} component        The component responsible for handling the stop event.
         * @returns {object}                The draggable configuration.
         *
         * NOTE: The `component` must implement a dropHandler.
         */
        draggableComponentConfig: function(component) {

            //add hover effect
            component.getElement().hover(function () {
                component.getElement().removeClass(component.icon).addClass(component.hoverIcon);
            }, function () {
                component.getElement().removeClass(component.hoverIcon).addClass(component.icon);
            })

            return {
                zIndex: 1011,
                revert: true,
                revertDuration: 0,
                cancel: false,
                containment: 'body',
                cursor: '-webkit-grabbing',
                start: function (e, ui) {
                    // hide the context menu if necessary
                    nf.ContextMenu.hide();
                },
                stop: function (e, ui) {
                    var translate = nf.Canvas.View.translate();
                    var scale = nf.Canvas.View.scale();

                    var mouseX = e.originalEvent.pageX;
                    var mouseY = e.originalEvent.pageY - nf.Canvas.CANVAS_OFFSET;

                    // invoke the drop handler if we're over the canvas
                    if (mouseX >= 0 && mouseY >= 0) {
                        // adjust the x and y coordinates accordingly
                        var x = (mouseX / scale) - (translate[0] / scale);
                        var y = (mouseY / scale) - (translate[1] / scale);

                        //each component must implement a dropHandler function
                        component.dropHandler.apply(component, [{
                            x: x,
                            y: y
                        }]);
                    }
                },
                helper: component.dragIcon
            }
        }
    }

    var toolboxCtrl =
        new ToolboxCtrl(processorComponent,
            inputPortComponent,
            outputPortComponent,
            groupComponent,
            remoteGroupComponent,
            funnelComponent,
            templateComponent,
            labelComponent);
    return toolboxCtrl;
};