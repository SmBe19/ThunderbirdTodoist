# ThunderbirdTodoist
Thunderbird Add-On for [Todoist](https://todoist.com).

Not created by, affiliated with, or supported by Doist.

## Installation
To install the add-on, download the xpi file from [here](https://dl.smeanox.com/thunderbird-todoist-0.2.xpi). Open the add-ons page in Thunderbird and choose 'install from file'.
Register the protocol in your OS following the instructions below.


### Linux

```
mv thundoist.desktop ~/.local/share/applications/
```


### Windows (untested)

Update the registry using powershell

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
  New-ItemProperty -LiteralPath "${key}\shell\open\command" -Name '(default)' -Value '\"C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe\" -mail \"%1\' -PropertyType String -Force -ea SilentlyContinue
  }
```

### Linux

Install the desktop file and register the handler

``` bash
cat > ~/.local/share/applications/thundoist-imap.desktop << EOF
[Desktop Entry]
Type=Application
Name=Thundoist Scheme Handler - IMAP
Exec=thunderbird -mail '%u'
StartupNotify=false
MimeType=x-scheme-handler/imap-message;
EOF

cat > ~/.local/share/applications/thundoist-mailbox.desktop << EOF
[Desktop Entry]
Type=Application
Name=Thundoist Scheme Handler - Mailbox
Exec=thunderbird -mail '%u'
StartupNotify=false
MimeType=x-scheme-handler/mailbox-message;
EOF

xdg-mime default thundoist-imap.desktop x-scheme-handler/imap-message
xdg-mime default thundoist-mailbox.desktop x-scheme-handler/mailbox-message
```

### Mac

TBA
