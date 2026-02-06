# ApexToDotNet
Collaboration to build an Apex to .Net Migrator

## Overview

This repository contains tools, guidance, and best practices for migrating Oracle APEX applications to Angular/.NET architecture.

## Getting Started

For comprehensive migration guidance, see the [Copilot Agent Instructions](.github/agents/apex-to-dotnet-migration-guide.md) which provide:

- **10-step migration approach** covering everything from workflow inventory to delivery planning
- **Strangler Fig pattern** for incremental, low-risk migration
- **Architecture guidance** for building .NET APIs and Angular frontends
- **Testing strategies** to ensure behavioral parity
- **Coexistence patterns** for running APEX and Angular/.NET side-by-side

## Key Principles

1. **Workflow-First**: Migrate complete user journeys, not individual pages
2. **Extract Business Logic**: Move domain knowledge from PL/SQL to C# services
3. **Incremental Migration**: Use Strangler Fig pattern over Big Bang
4. **Clear Architecture**: Build with explicit seams between layers
5. **Prove Parity**: Test for behavioral equivalence, not just functionality

## Documentation

- [APEX to .NET Migration Guide](.github/agents/apex-to-dotnet-migration-guide.md) - Comprehensive migration strategy and implementation guide
- [Agent Instructions README](.github/agents/README.md) - Overview of Copilot Agent guidance

## Contributing

This is an internal collaboration project. For questions or contributions, please reach out to the migration team.
