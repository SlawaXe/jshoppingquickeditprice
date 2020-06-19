(function($) {
    $(function() {

    if(location.search.indexOf('&task=edit') == -1) {
        $('.admin.com_jshopping #adminForm table tbody tr').each(function(index, el) {
           $(this).find("td").each(function(index, el) {
               $(this).attr('data-td-index', index);
               $(this).wrapInner('<span class="actual-price"></span>');
           });
        });

        var htmlQuickEditPrice = '<div class="htmlQuickEditPrice">' +
             '<div class="quickEditPrice-form">' +
              '<div>' +
             '<input type="text" value="" name="quickEditPrice"><button class="btn btn-sm btn-quickEditPriceSubmit"><span class="icon-apply" aria-hidden="true"></span></button>' +
             '</div>' +
             '</div>' +
             '<a class="btn btn-micro btn-quickEditPrice" href="#"><span class="icon-pencil-2" aria-hidden="true"></span></a>' +
            '</div>';

        $('.admin.com_jshopping #adminForm table tbody td[data-td-index="7"]')
            .css('position','relative')
            .append(htmlQuickEditPrice);

        $(".htmlQuickEditPrice").each(function(index, el) {
            var that = $(this);
            $(document).mouseup(function (e){
              var div = that;
              if (!div.is(e.target) && div.has(e.target).length === 0) { 
                div.removeClass('active');
              }
            });
        });

        $(document).on('click', '.btn-quickEditPrice', function(event) {
            event.preventDefault();
            var that = $(this);
            var idProduct = $(this).parents('tr').find('[name="cid[]"]').val();
            $(this).parents('td').find('.htmlQuickEditPrice').toggleClass('active');
            jQuery.ajax({
                type: "POST",
                url: "index.php?option=com_ajax&plugin=quickeditprice&format=json",
                data: {
                    method: 'quickeditpriceGetPrice',
                    idProduct: idProduct
                },
                success: function(data) {
                    that.parents('td').find('[name="quickEditPrice"]').val(data.data[0]);
                }
            });
        });

        $(document).on('click', '.btn-quickEditPriceSubmit', function(event) {
            event.preventDefault();
            var that = $(this);
            var idProduct = $(this).parents('tr').find('[name="cid[]"]').val();
            var newPrice = $(this).parents('td').find('[name="quickEditPrice"]').val();
            jQuery.ajax({
                type: "POST",
                url: "index.php?option=com_ajax&plugin=quickeditprice&format=json",
                data: {
                    method: 'quickeditpriceSetPrice',
                    idProduct: idProduct,
                    price: newPrice
                },
                success: function(data) {
                    if( data.data[0]['result'] ) {
                        var actualPrice = that.parents('td').find('.actual-price').text();
                        that.parents('td').find('.actual-price').html(data.data[0]['newPriceRender']);
                        that.parents('td').find('.htmlQuickEditPrice').addClass('success');
                        setTimeout(function() {
                            that.parents('td').find('.htmlQuickEditPrice').toggleClass('active');
                            that.parents('td').find('.htmlQuickEditPrice').removeClass('success');
                        }, 800);
                    }
                }
            });
        });
    } // END is page list product

    });
})(jQuery);