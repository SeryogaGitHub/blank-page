<?php
$json = file_get_contents('./products,json');
$json = json_decode($json);

$message = '';
$message .= "<h1>Заказ в магазине</h1>";
$message .= "<p>Телефон".$_POST['tel-input']."</p>";
$message .= "<p>Имя".$_POST['name-input']."</p>";

$cart = $_POST['cart'];

foreach ($cart as $id=>$count){
  $message .= $json[$id]['Товар'];
}

print_r($message);