<?php
$json = file_get_contents('./price.json');
$json = json_decode($json, true);

$message = '';
$message .= "<h1>Заказ в магазине</h1>";
$message .= "<p>Имя: " . $_POST['name'] . "</p>";
$message .= "<p>Телефон: " . $_POST['tel'] . "</p>";

$cart = $_POST['cart'];
$totalSum = $_POST['totalSum'];

foreach ($cart as $id => $count) {
  $message .= "<h2>Товар на общую сумму: ".$count * $json[$id]["Цена"]." грн.</h2>";
  $message .= '<p>Название товара: ' . $json[$id]['Товар'] . '</p>';
  $message .= '<p>Производитель: ' . $json[$id]['Производитель'] . '</p>';
  $message .= '<p>Количество: ' . $count . '</p>';
}

$message .= "<p style='text-align: right;'>Всего: ".$totalSum."</p>";

$return_message = "";
$to = "work.email.seryoga@gmail.com, vlf@express-med.com.ua, pavlenkoelis@gmail.com";

$headers = "From: noreply@website.com/\r\n";
$headers .= "Content-type: text/html; charset=utf-8 \r\n";
$send_mail = mail($to, "Заказ в магазине", $message, $headers);

if ($send_mail) {
  $return_message = "mail_success";
} else {
  $return_message = "mail error";
}
echo $return_message;

exit();