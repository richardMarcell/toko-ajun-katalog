ALTER TABLE `products`
  ADD `ep_valid_term` INT COMMENT 'Menyimpan jangka waktu sebuah entry pass berlaku dalam konversi hari dan digunakan di Entry Pass' AFTER `swimming_class_valid_for`;
