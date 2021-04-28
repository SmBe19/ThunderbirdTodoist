# ThunderbirdTodoist
Thunderbird Add-On for [Todoist](https://todoist.com).

Not created by, affiliated with, or supported by Doist.

## Installation
To install the add-on, download the xpi file from [here](https://dl.smeanox.com/thunderbird-todoist-0.2.xpi). Open the add-ons page in Thunderbird and choose 'install from file'.

### Mail-Links
To support Mail-Links (i.e. direct links from Todoist to open a mail in Thunderbird), you need to register the protocol in the OS.

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
  New-ItemProperty -LiteralPath "${key}\shell\open\command" -Name '(default)' -Value '\"C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe\" -mail \"%1\' -PropertyType String -Force -ea SilentlyContinue
  }
```

## Credits
The Mail-Links implementation is based on code by [John Ferlito](https://github.com/johnf).
