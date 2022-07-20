# ThunderbirdTodoist
Thunderbird Add-On for [Todoist](https://todoist.com).

Not created by, affiliated with, or supported by Doist.

## Overview
This plugin adds a button to Thunderbird to add a new task for the selected email. Project and due date can be set directly when adding a task. It is also possible to add a link to the task which opens the email in Thunderbird.

## Installation
To install the add-on, visit the [add-on page](https://addons.thunderbird.net/de/thunderbird/addon/thunderbird-todoist/).

You can also download the xpi file from [here](https://dl.smeanox.com/thunderbird-todoist-0.4.xpi). Open the add-ons page in Thunderbird and choose 'install from file'.

### Mail-Links
To support Mail-Links (i.e. direct links from Todoist to open a mail in Thunderbird), you need to register the protocol in the OS.

Note that the link becomes invalid once the email has been moved to a different folder in Thunderbird.

### Linux

``` bash
cat > ~/.local/share/applications/thunderbird-todoist.desktop << EOF
[Desktop Entry]
Type=Application
Name=Thunderbird Todoist Scheme Handler
Exec=thunderbird -mail '%u'
StartupNotify=false
MimeType=x-scheme-handler/mailbox-message;x-scheme-handler/imap-message;
EOF

xdg-mime default thunderbird-todoist.desktop x-scheme-handler/mailbox-message
xdg-mime default thunderbird-todoist.desktop x-scheme-handler/imap-message
```

### Windows (untested)

Update the registry using powershell:

``` powershell
$types = @('imap-message', 'mailbox-message')
Foreach ($type in $types) {
  $key = "HKLM:\SOFTWARE\Classes\${type}"
  New-Item $key -force -ea SilentlyContinue
  New-Item "${key}\shell" -force -ea SilentlyContinue
  New-Item "${key}\shell\open" -force -ea SilentlyContinue
  New-Item "${key}\shell\open\command" -force -ea SilentlyContinue
  New-ItemProperty -LiteralPath $key -Name '(default)' -Value 'URL:Thunderbird Todoist Links' -PropertyType String -Force -ea SilentlyContinue
  New-ItemProperty -LiteralPath $key -Name 'URL Protocol' -Value '' -PropertyType String -Force -ea SilentlyContinue
  New-ItemProperty -LiteralPath "${key}\shell\open\command" -Name '(default)' -Value '"C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe" -mail "%1"' -PropertyType String -Force -ea SilentlyContinue
  }
```

If you have issues with getting this to work, please check out [this issue](https://github.com/SmBe19/ThunderbirdTodoist/issues/13) and comment there, if this does not resolve it.

## Credits
The Mail-Links implementation is based on code by [John Ferlito](https://github.com/johnf).
