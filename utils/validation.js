var valid = {
    checkEmail: function(email) {       //example
        var exp = /^\w{1,}@\w{1,}[.]\w{2,3}$/g
        if (email.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkPhone: function(phone){
        var exp = /^\s{0,}\d{8}\s{0,}$/g
        if (phone.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkName: function(name){
        var exp = /^\s{0,}[A-ZÑña-z\s]{2,30}\s{0,}$/g
        if (name.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkPassword: function (password) {
        var exp = /^\s{0,}(?=.*[a-zA-Z])(?=.*\d)\S{6,}\s{0,}$/g;
        if (password.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkUser: function (user) {
        var exp = /^\s{0,}[\S]{5,15}\s{0,}$/g
        if (user.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkTitle: function(title){
        var exp = /^[\w\W]{3,50}$/g
        if (title.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkPrice: function(price){
        var exp = /^\d{1,10}[.]{0,1}\d{0,2}$/g
        if (price.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkDescription: function(description){
        var exp = /^[\w\W]{3,200}$/g
        if (description.match(exp) == null) {
            return false;
        }
        return true;
    },

    checkQuantity: function(quantity) {
        var exp = /^[0-9]{1,}$/g
        if (quantity.match(exp) == null) {
            return false;
        }
        return true;
    },

};
module.exports = valid;
