---
title: "Setting up Mac-like zsh keyboard shortcuts on a Mac"
tags:  software mac
---

For some reasons, configuring keyboard shortcuts for the shell is truly bizarre in Mac OS and Linux. It involves figuring out arcane character sequences like `\e\e\x17` and `^[[H`. 

I haven't had time to look into the reasons for this weirdness (it's most likely historical), but over the several attempts I made to set this up, I haven't been able to discern a pattern in these character sequences. 

I haven't found a good source of documentation, and the blog posts list lots of different sequences which are all supposed to do the same thing, but mostly don't work. 

Anyway, I managed to setup a minimum set of shortcuts for myself to use on OS X with iTerm2 and zsh. 

Add the following to `~/.zshrc`:

    bindkey -e
    # Option-Right
    bindkey '\e\e[C' forward-word
    # Option-Left
    bindkey '\e\e[D' backward-word

    # Cmd-Left
    bindkey "^[[H" beginning-of-line
    # Cmd-Right
    bindkey "^[[F" end-of-line
    
Then reload `.zshrc` (in the current terminal) with 

    . ~/.zshrc
    
Another thing that's nice is being able to use Option-Delete to delete words backwards. However, I haven't found the magical sequence for `.zshrc` that would do it. The only solution I found was going into global shortcut preferences in iTerm2, and setting up the following:

- Keyboard shortcut: Option-Delete
- Action: Send hex codes
- Value: 17 (*note:* not 0x17 or x17, but just 17)

It would be nice to have a few more productive shortcuts like that, but I've already wasted an hour on this!
