<?php
// Запрет прямого доступа.
defined('_JEXEC') or die('Restricted access');

/**
* .plgSystemQuickeditprice
*/
class plgSystemJshoppingquickeditprice extends JPlugin {
    function onBeforeCompileHead() {
        if( $_SERVER['PHP_SELF'] == '/administrator/index.php' && $_GET['option'] == 'com_jshopping' && $_GET['controller'] == 'products' ) {
            $document = JFactory::getDocument();
            $document->addScript(JURI::root() . 'plugins/system/jshoppingquickeditprice/js/quickeditprice.js');
            $document->addStyleSheet(JURI::root() . 'plugins/system/jshoppingquickeditprice/css/quickeditprice.css');
        }
    }
    
    function onAjaxQuickeditprice() {
        $idProduct = $_POST['idProduct'];

        if( $_POST['method'] == 'quickeditpriceGetPrice' && !empty($_POST['idProduct']) ) {
            return $this->getPrice($idProduct);
        } else if( $_POST['method'] == 'quickeditpriceSetPrice' ) {
            if( !empty($_POST['idProduct']) && !empty($_POST['price']) ) {
                return $this->setPrice($idProduct, $_POST['price']);
            }
        } else {
            return 'Неизвестный method';
        }
    }

    function getPrice($idProduct) {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('*')
              ->from($db->quoteName('#__jshopping_products'))
              ->where($db->quoteName('product_id') . ' = ' . $idProduct);
        $db->setQuery($query);
        $result = $db->loadObjectList();

        return $result[0]->min_price;
    }

    function getCurrency() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('*')
              ->from($db->quoteName('#__jshopping_currencies'))
              ->where($db->quoteName('currency_id') . ' = 1');
        $db->setQuery($query);
        $result = $db->loadObjectList();

        return $result[0]->currency_name;
    }

    function setPrice($idProduct, $newPrice) {
        $fullPrice = number_format($newPrice, 6, '.', '');
        $newPriceRender = number_format($newPrice, 0, '.', ' ');
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        
        $fields = array(
            $db->quoteName('min_price') . ' =  ' . (float) $newPrice,
            $db->quoteName('product_price') . ' = ' . (float) $fullPrice
        );
        
        $conditions = array(
            $db->quoteName('product_id') . ' = ' . $idProduct,
        );

        $query->update($db->quoteName('#__jshopping_products'))->set($fields)->where($conditions);
        $db->setQuery($query);
        $result = $db->execute();

        return Array('result' => $result, 'newPriceRender' => $newPriceRender . ' ' . $this->getCurrency());
    }

}