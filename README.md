# ThunderbirdTodoist
Thunderbird Add-On for [Todoist](https://todoist.com).

Not created by, affiliated with, or supported by Doist.

## Overview
This plugin adds a button to Thunderbird to add a new task for the selected email. Project and due date can be set directly when adding a task. It is also possible to add a link to the task which opens the email in Thunderbird.

## Installation
To install the add-on, visit the [add-on page](https://addons.thunderbird.net/de/thunderbird/addon/thunderbird-todoist/).

You can also download the xpi file from [here](https://dl.smeanox.com/thunderbird-todoist-0.6.xpi). Open the add-ons page in Thunderbird and choose 'install from file'.

### Mail-Links
To support Mail-Links (i.e. direct links from Todoist to open a mail in Thunderbird), you need to register the protocol in the OS.

If you have installed this prior to version 0.6 you will need to follow the instructions below again to add support for the new protocol. Note that the URL format changed with version 0.6 of the extension. If you still have links created with a prior version of the extension, follow the instructions [here](docs/maillinks-legacy.md) to register the previously used protocol.

### Linux

``` bash
cat > ~/.local/share/applications/thunderbird-todoist-mid.desktop << EOF
[Desktop Entry]
Type=Application
Name=Thunderbird Todoist
Exec=thunderbird '%u'
StartupNotify=false
MimeType=x-scheme-handler/mid;
EOF

xdg-mime default thunderbird-todoist-mid.desktop x-scheme-handler/mid
```

### Windows (untested)

Update the registry using powershell:

``` powershell
$types = @('mid')
Foreach ($type in $types) {
  $key = "HKLM:\SOFTWARE\Classes\${type}"
  New-Item $key -force -ea SilentlyContinue
  New-Item "${key}\shell" -force -ea SilentlyContinue
  New-Item "${key}\shell\open" -force -ea SilentlyContinue
  New-Item "${key}\shell\open\command" -force -ea SilentlyContinue
  New-ItemProperty -LiteralPath $key -Name '(default)' -Value 'URL:Thunderbird Todoist Links' -PropertyType String -Force -ea SilentlyContinue
  New-ItemProperty -LiteralPath $key -Name 'URL Protocol' -Value '' -PropertyType String -Force -ea SilentlyContinue
  New-ItemProperty -LiteralPath "${key}\shell\open\command" -Name '(default)' -Value '"C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe" "%1"' -PropertyType String -Force -ea SilentlyContinue
  }
```

Alternatively, create a file with a `.reg` extension (e.g. `todoist-thunderbird-mid.reg`) with the following content, then double click it:

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\mid]
@="URL:Thunderbird Todoist Links"
"URL Protocol"=""

[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\mid\shell]

[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\mid\shell\open]

[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\mid\shell\open\command]
@="\"C:\\Program Files (x86)\\Mozilla Thunderbird\\thunderbird.exe\" %1"
```

If you have issues with getting this to work, please check out [this issue](https://github.com/SmBe19/ThunderbirdTodoist/issues/13) and comment there if this does not resolve it.
