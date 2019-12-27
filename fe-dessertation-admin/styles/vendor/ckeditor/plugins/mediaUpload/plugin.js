CKEDITOR.plugins.add('mediaUpload', {
    icons: 'mediaUpload',
    init: function (editor) {
        editor.ui.addButton('MediaUpload', {
            label: 'Media upload',
            command: 'mediaUpload',
            toolbar: 'insert,100'
        });
    }
});