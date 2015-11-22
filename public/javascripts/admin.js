
//Protect the global namespace
(function() {
    $('#save').on('click', function(e) {
        e.preventDefault();

        $('#publish').val(0);
        submit();
    });

    $('#saveAndPublish').on('click', function(e) {
        e.preventDefault();
        $('#publish').val(1);
        submit();
    });

    function submit() {
        $('#blogForm').submit();
    }
}());