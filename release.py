#!/usr/bin/env python3

import json
import os
import zipfile

with open('thunderbird-todoist/manifest.json') as f:
    manifest = json.load(f)

version = manifest['version']
filename = 'thunderbird-todoist-{}.xpi'.format(version)

with zipfile.ZipFile(filename, 'w') as zfile:
    os.chdir('thunderbird-todoist')
    for dirname, dirs, files in os.walk('.'):
        for fil in files:
            zfile.write(os.path.join(dirname, fil))
