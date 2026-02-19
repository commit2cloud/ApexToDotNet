#!/bin/bash

echo "🔧 Installing .NET SDK..."
echo ""

# Install the package
echo "Step 1: Installing .NET SDK package (will ask for password)..."
sudo installer -pkg /opt/homebrew/Caskroom/dotnet-sdk/10.0.103/dotnet-sdk-10.0.103-osx-arm64.pkg -target /

echo ""
echo "Step 2: Adding .NET to PATH..."

# Add to .zshrc if not already there
if ! grep -q "dotnet" ~/.zshrc 2>/dev/null; then
    echo 'export PATH="/usr/local/share/dotnet:$PATH"' >> ~/.zshrc
    echo "✅ Added .NET to ~/.zshrc"
else
    echo "✅ .NET already in ~/.zshrc"
fi

# Add to .bash_profile if it exists
if [ -f ~/.bash_profile ]; then
    if ! grep -q "dotnet" ~/.bash_profile; then
        echo 'export PATH="/usr/local/share/dotnet:$PATH"' >> ~/.bash_profile
        echo "✅ Added .NET to ~/.bash_profile"
    fi
fi

echo ""
echo "Step 3: Setting PATH for current session..."
export PATH="/usr/local/share/dotnet:$PATH"

echo ""
echo "Step 4: Verifying installation..."
if command -v dotnet &> /dev/null; then
    dotnet --version
    echo ""
    echo "✅ .NET SDK installed successfully!"
    echo ""
    echo "To use in NEW terminal windows, run: source ~/.zshrc"
else
    echo "⚠️  Installation completed but dotnet not found in PATH"
    echo "You may need to restart your terminal"
fi

echo ""
echo "Done! 🎉"
