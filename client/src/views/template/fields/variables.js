/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2015 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: http://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/
Espo.define('views/template/fields/variables', 'views/fields/base', function (Dep) {

    return Dep.extend({

        inlineEditDisabled: true,

        detailTemplate: 'template/fields/variables/detail',

        editTemplate: 'template/fields/variables/edit',

        data: function () {
            return {
                attributeList: this.attributeList,
                entityType: this.model.get('entityType'),
                translatedOptions: this.translatedOptions
            };
        },

        events: {
            'change [name="variables"]': function () {
                var attribute = this.$el.find('[name="variables"]').val();
                if (attribute != '') {
                    this.$el.find('[name="copy"]').val('{{' + attribute + '}}');
                } else {
                    this.$el.find('[name="copy"]').val('');
                }
            }
        },

        setup: function () {
            this.setupFieldList();

            this.listenTo(this.model, 'change:entityType', function () {
                this.setupFieldList();
                if (this.isRendered()) {
                    this.reRender();
                }
            }, this);
        },

        setupFieldList: function () {
            var entityType = this.model.get('entityType');

            var attributeList = this.getFieldManager().getEntityAttributes(entityType) || [];
            attributeList.push('id');
            if (this.getMetadata().get('entityDefs.' + entityType + '.fields.name.type') == 'personName') {
                attributeList.unshift('name');
            };
            attributeList = attributeList.sort(function (v1, v2) {
                return this.translate(v1, 'fields', entityType).localeCompare(this.translate(v2, 'fields', entityType));
            }.bind(this));

            this.attributeList = attributeList;

            attributeList.unshift('');

            this.translatedOptions = {};
            attributeList.forEach(function (item) {
                this.translatedOptions[item] = this.translate(item, 'fields', entityType);
            }, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
        }

    });

});
