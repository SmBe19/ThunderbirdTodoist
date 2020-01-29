#!/bin/sh
inkscape --without-gui Icon.svg --export-area-page --export-width=64 --export-height=64 --export-png=icon.png
inkscape --without-gui Icon.svg --export-area-page --export-width=32 --export-height=32 --export-png=icon_32.png
inkscape --without-gui Icon.svg --export-area-page --export-width=16 --export-height=16 --export-png=icon_16.png
