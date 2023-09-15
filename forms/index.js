const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.maxlength(320),
                validators.email(),
                validators.required()
            ]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!@*()^#]+$/)
            ]
        }),
    })
};

const createProductForm = (post_category=[], genres=[]) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/)
            ]
        }),
        'price': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/)]
        }),
        'stock': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.integer()]
        }),
        'post_category_id': fields.string({
            label:'Post Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: post_category,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'genres': fields.string({
            label:'Genres',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: genres
        }),
        'chapter_content': fields.strings({
            required: false,
            widget: widgets.textarea({
                rows:20,
                cols:40
            }),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/),
                validators.maxlength(100000)
            ]
        }),
        'image_url': fields.string({
            widget: widgets.hidden(),
            validators:[validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/)]
        }),
        'thumbnail_url': fields.string({
            widget: widgets.hidden(),
            validators:[validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/)]
        })
    })
};

const createRegisterForm = () => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.email()]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!@*()^#]+$/)
            ]
        }),
        'passwordConfirmation': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
};

const createSearchForm = (post_category=[], genres=[]) => {
    return forms.create({
        'name': fields.string({
            label: "Name of work",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/)
            ]
        }),
        'user': fields.string({
            label: "Creator name",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!@]+$/)
            ]
        }),
        'min_price': fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()]
        }),
        'max_price': fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()] 
        }),
        'post_category_id': fields.string({
            label:'Post Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: post_category,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'genres': fields.string({
            label: 'Genres',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: genres
        })
    })
};


module.exports = { bootstrapField, createProductForm, createLoginForm, createRegisterForm, createSearchForm };

