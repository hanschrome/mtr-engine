<?php

while(!file_exists('stop')) {
    file_get_contents('http://localhost:3000/instance/?id=1&engine=linear_function');
    sleep(10);
}
