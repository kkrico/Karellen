﻿$(function () {
    if (App.SuportaAjax()) {
        $(document).pjax('[data-pjax] a, a[data-pjax]', '#sidewrapper',
        {
            fragment: "#sidewrapper"
        });


        $(document).on('pjax:end', function (xhr, options) {
            var elemento = xhr.relatedTarget;

            if (typeof(elemento) === "undefined") {
                window.location.reload(false);
                return;
            }


            var fn = $(elemento).data("callback");
            if (typeof (fn) !== "undefined") {
                App[fn]();
            }
        })
    }
});