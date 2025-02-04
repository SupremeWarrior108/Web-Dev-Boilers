$('.dayNight input').change(function () {
    $('body').toggleClass('day', $(this).is(':checked'))
});