CUEgenerator
=============
A small utility which facilitates creating cue files from track lists.

# How to report bugs

Please create [a new issue](https://github.com/dVaffection/cuegenerator-react/issues) in this repository and leave as many details as possible.

# Documentation
## Track list highlights

* In case if a local performer is absent the global one is used, e.g.
![](https://user-images.githubusercontent.com/457097/111331254-b81dff00-863e-11eb-9b80-cc7504f4d6fd.png)

* Performer and title track separators:
    * `' - '` — 45 (hyphen-minus)
    * `' – '` — 8211 (en dash)
    * `' ‒ '` — 8210 (figure dash)
    * `' — '` — 8212 (em dash)
    * `' ― '` — 8213 (horizontal bar)
* Timings recognition:
    * `[08:45] 03. 8 Ball` → `08:45`
    * `01.[18:02] Giuseppe` → `18:02`
    * `10:57 02. Space Manoeuvres` → `10:57`
    * `56:53 T.O.M'` → `56:53`
    * `1:02:28 Mossy` → `62:28`

## Regions list recognition
* Sony Sound Forge format `dd:dd:dd[.,]dd`
* Adobe Audition format `dd:dd:dd:dd`
* Audacity format `ddddd.dddddd`


# For developers

This is a React frontend to the [BFF](https://github.com/DmitryVarennikov/cuegenerator-server). 


