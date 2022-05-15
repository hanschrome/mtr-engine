# MTR - Multi trading robot

This software works with different algorithms and instances in order to work with multiple trading strategies.

## How does it work?

Concept list:

- Algorithm: We understand an algorithm as the logic to trade. This repository has no algorithm, they have to be installed.
- Instance: An instance is an entity with an assigned algorithm and a config file. The config file usually comes with a maxium budget.

With this two concepts we can understand how MTR works. Algorithms are installed, instances are created, each instance has its own properties.

It is possible, and it is intentional to have multiple instances running in order to apply multiple strategies to the market.

## How to set up

Good practise is to run unit tests:

$ make install && make unit

This will create a couple of docker containers, one for a php and another one for nodejs. Nodejs will run the bot service
 and php will allow you to manage how the requests are made.