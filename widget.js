WAF.define('Radio', ['waf-core/widget', 'DropDown'], function(widget, DropDown) {
    "use strict";

    var Radio = widget.create('Radio', DropDown, {
        tagName: 'ul',
        render: function(elements) {
            var s = '';
            s += elements.map(function(element, index) {
                return '<li>' + 
                    '<input type="radio" name="' + this.id + '" id="' + this.id + '-' + index + '" value="' + element.value + '">' +
                    '<label for="' + this.id + '-' + index + '">' + element.label + '</label>' +
                    '</li>';
            }.bind(this)).join('');
            this.node.innerHTML = s;
            this._valueChangeHandler();
        },
        _valueChangeHandler: function() {
            var value = this.value();
            var opt = $('[value=' + (value || '') + ']', this.node).get(0);
            if(opt) {
                opt.checked = true;
            } else {
                this.fire('errorNotFound');
            }
        },
        getSelectedIndex: function() {
            return $('input:checked', this.node).parent().index();
        },
        init: function() {
            DropDown.prototype.init.call(this);
            var that = this;
            $(this.node).on('mousedown', function(event) {
                var node = event.target;
                if(node.tagName === 'LABEL') {
                    node = document.getElementById(node.for);
                }
                if(node.tagName !== 'INPUT') {
                    return;
                }
                var $node = $(node);
                if(node.checked && that.allowEmpty()) {
                    var uncheck = function(){
                        setTimeout(function() {
                            node.checked = false;
                            that._setValueByPosition(-1);
                        }, 0);
                    };
                    var unbind = function(){
                        $node.unbind('mouseup', up);
                    };
                    var up = function(){
                        uncheck();
                        unbind();
                    };
                    $node.bind('mouseup', up);
                    $node.one('mouseout', unbind);
                } else {
                    node.checked = true;
                    var position = that.getSelectedIndex();
                    that._setValueByPosition(position);
                }

            });
        }
    });

    return Radio;

});
