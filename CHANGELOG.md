# Changelog

## [1.5.0](https://github.com/r3oath/burst-type.pro/compare/v1.4.0...v1.5.0) (2023-07-28)


### Features

* add a credits screen and contributors list ([0acd447](https://github.com/r3oath/burst-type.pro/commit/0acd447300ef8af6c3a2e6287a836ed7e2d2ed21))
* add confetti celebration effect after streak and game completion (under new SFX menu) ([135f4a6](https://github.com/r3oath/burst-type.pro/commit/135f4a6236cb1be75c40d8347d1bdf5fc16564fc))
* add sound effects for typing, errors, and streak completion ([96ddf3e](https://github.com/r3oath/burst-type.pro/commit/96ddf3eac406bf4bc183cbf1b4a9b4ce32eed956))

## [1.4.0](https://github.com/r3oath/burst-type.pro/compare/v1.3.0...v1.4.0) (2023-07-14)


### Features

* add the ability to configure custom wordlists or select a preset ([9593cb3](https://github.com/r3oath/burst-type.pro/commit/9593cb34039b5470128ff25b7d9358c7301d88e4))

## [1.3.0](https://github.com/r3oath/burst-type.pro/compare/v1.2.0...v1.3.0) (2023-07-11)


### Features

* improve the word visualiser error state labels, colours, and streak bar ([289b4fd](https://github.com/r3oath/burst-type.pro/commit/289b4fd1a7c850074ea7fe406eb102c51fbc85f6))

## [1.2.0](https://github.com/r3oath/burst-type.pro/compare/v1.1.1...v1.2.0) (2023-07-06)


### Features

* add basic light and dark mode themes ([038c425](https://github.com/r3oath/burst-type.pro/commit/038c42529a68403e1b177986d0c24ed56164178d))
* add the ability to set custom WPM and streak values ([b21ccb1](https://github.com/r3oath/burst-type.pro/commit/b21ccb11a72d298d0331ddff82534f30c980206a))

## [1.1.1](https://github.com/r3oath/burst-type.pro/compare/v1.1.0...v1.1.1) (2023-07-05)


### Bug Fixes

* fix the WPM calculation logic ([3db8326](https://github.com/r3oath/burst-type.pro/commit/3db8326463e023acacf70d022967b207d0b4293c))

## [1.1.0](https://github.com/r3oath/burst-type.pro/compare/v1.0.0...v1.1.0) (2023-07-04)


### Features

* add app footer with links to GitHub, the license, issues, and the current version ([cb29172](https://github.com/r3oath/burst-type.pro/commit/cb291720ec11d508fa5862f2a406636a23fe7a91))

## 1.0.0 (2023-07-03)


### Features

* add an experimental build warning for non-production domains ([29af0cf](https://github.com/r3oath/burst-type.pro/commit/29af0cf711000893339550c179e9c4e6bba703fa))
* add last saved label and update the UI ([f599e89](https://github.com/r3oath/burst-type.pro/commit/f599e8987f6bfac5a1526b5aa2c48e86420dd2f9))
* add reset confirmation dialog and improve UI ([cf6ee93](https://github.com/r3oath/burst-type.pro/commit/cf6ee9328b39aa989bc290482da012a703bd34a8))
* add save state confirmation alert ([21a38a0](https://github.com/r3oath/burst-type.pro/commit/21a38a096f9000b449d5521220967bdb0baea436))
* add site metadata ([486fd24](https://github.com/r3oath/burst-type.pro/commit/486fd24cf46395012d7eea22d6762072d85a8f17))
* add streak option ([52234de](https://github.com/r3oath/burst-type.pro/commit/52234de580715e3415cc7014e25f132accf39563))
* add tab and enter support and fail the current word if the buffer is not full and space, enter, or tab is pressed ([1847019](https://github.com/r3oath/burst-type.pro/commit/18470194c3cec66249ed620413b8adce4fde902a))
* add the ability to move back and forth through your discovered word set ([302e948](https://github.com/r3oath/burst-type.pro/commit/302e94898a26525a241b5d974b61a662a257b59f))
* add visual indicator to signify that typing can begin ([376b139](https://github.com/r3oath/burst-type.pro/commit/376b1396378d4d7b7b183cebb03752d5ff7f6084))
* complete the current word when the buffer is full ([17ed0b6](https://github.com/r3oath/burst-type.pro/commit/17ed0b6a4f7aca610c6e4fea064137fd03ab92e6))
* handle end of game logic ([79a49ec](https://github.com/r3oath/burst-type.pro/commit/79a49ec541b6496524c988ad045c14ee69ddff87))
* increase the number of WPM and streak options ([999fa71](https://github.com/r3oath/burst-type.pro/commit/999fa716c1776148c057b7eb6e315447cfefa6b8))
* require the spacebar to be pressed to confirm the active word, immediately fail on spelling mistakes, and start the next streak on the current word when typing begins ([806c2db](https://github.com/r3oath/burst-type.pro/commit/806c2db23fcae20ef2653ea89a2cd3b11de0a155))
* save and load state from local storage ([8a19e0c](https://github.com/r3oath/burst-type.pro/commit/8a19e0c898035122371dcab706181fc15d99459d))
* update the app name and show an instruction page on the first load ([d60ff7c](https://github.com/r3oath/burst-type.pro/commit/d60ff7cf3e448745ccfb0403b27fbfadc456a496))
* update the core behaviour so that no tabbing is required between words ([ee2a1bc](https://github.com/r3oath/burst-type.pro/commit/ee2a1bce6c84e022a9c23e5b26ce00da6c96bf27))
* update wordlist and level UI indicators ([36632ac](https://github.com/r3oath/burst-type.pro/commit/36632acd8dd0b772f76e639657c0aabce0fead5e))


### Bug Fixes

* allow word reset with an empty buffer, and improve UI ([1ee4694](https://github.com/r3oath/burst-type.pro/commit/1ee469408311386b85c7fd5fbda9b350cfbd48c9))
* ensure showInstructions is set for legacy saved states ([f677486](https://github.com/r3oath/burst-type.pro/commit/f67748634004262e3721c7275472a38c5311bdc9))
* ensure that legacy saved state migration does not override the existing current state ([5e7ba02](https://github.com/r3oath/burst-type.pro/commit/5e7ba023f6551fde2887b6cb72770eb503901bf8))
* ensure that the state is saved on first load if there is no local storage copy present ([c1a0918](https://github.com/r3oath/burst-type.pro/commit/c1a0918dbc31223bfbf43ab757b3414825d6c4a1))
* ensure the state is removed from local storage when on the legacy domain and migration occurs ([5219640](https://github.com/r3oath/burst-type.pro/commit/52196407f836a5f0603775ae68a8e071ef9f2398))
* the non-legacy domain state migration/load logic ([2130414](https://github.com/r3oath/burst-type.pro/commit/2130414d3dfb8f7f598424045e2a0077bc9b8adc))
* update the save mechanism to only write state to local storage on level, reset, or preference changes ([debf1d9](https://github.com/r3oath/burst-type.pro/commit/debf1d966cba096e6472a1fc7bc228d50a38e035))
