# Database Console - Developer Tool

A powerful, interactive database console for development and debugging. This tool provides comprehensive database management capabilities with a modern, terminal-inspired interface.

## Features

### 🎯 Core Functionality
- **Real-time SQL Query Execution**: Execute any SQL query with syntax highlighting and error reporting
- **Table Explorer**: Browse all database tables with detailed schema information
- **Data Inspector**: View sample data from any table with pagination
- **Database Statistics**: Get comprehensive insights into your database structure and data
- **Schema Management**: Initialize and manage database tables

### 🔧 Development Tools
- **Common Queries**: Pre-built queries for frequent database operations
- **Query Performance**: Execution time tracking for performance analysis
- **Error Reporting**: Detailed error messages with context
- **Export Capabilities**: Copy query results for analysis

### 🎨 User Experience
- **Keyboard Shortcuts**: Toggle with `Ctrl+M`, close with `Escape`
- **Tabbed Interface**: Organized into Tables, Query, Stats, and Admin sections
- **Terminal Aesthetic**: Green-on-black terminal theme for developer comfort
- **Responsive Design**: Works on all screen sizes

## Installation & Setup

### 1. Dependencies
```typescript
// Required dependencies are already included:
// - @libsql/client (for Turso database)
// - React hooks for state management
```

### 2. Usage
```typescript
// Import and use in your page or component
import { DatabaseConsole } from "@/modules/dev/DatabaseConsole";

export default function DeveloperPage() {
  return (
    <div>
      {/* Your other content */}
      <DatabaseConsole />
    </div>
  );
}
```

### 3. Keyboard Shortcuts
- `Ctrl+M`: Toggle console visibility
- `Escape`: Close console
- `Enter`: Execute query (when in query textarea)

## Interface Overview

### Tables Tab
- **Table List**: Browse all database tables
- **Schema Viewer**: See CREATE statements and column definitions
- **Data Preview**: Sample rows from selected tables
- **Table Statistics**: Row counts and structure info

### Query Tab
- **SQL Editor**: Write and execute custom queries
- **Common Queries**: Quick access to frequently used queries
- **Result Display**: Formatted table output with performance metrics
- **Error Handling**: Clear error messages with execution context

### Stats Tab
- **Database Overview**: Total tables, rows, and structure metrics
- **Table Breakdown**: Individual table statistics and sizes
- **Performance Insights**: Query execution times and patterns

### Admin Tab
- **Table Management**: Initialize and refresh database tables
- **Development Tools**: PRAGMA commands and schema utilities
- **Maintenance**: Database cleanup and optimization tools

## Common Queries

The console includes pre-built queries for common operations:

### Database Information
```sql
-- List all tables
SELECT name, type FROM sqlite_schema 
WHERE type IN ('table', 'view') 
AND name NOT LIKE 'sqlite_%'
ORDER BY name;

-- Database overview
SELECT 
  (SELECT COUNT(*) FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%') as tables,
  (SELECT COUNT(*) FROM sqlite_schema WHERE type = 'index' AND name NOT LIKE 'sqlite_%') as indexes,
  (SELECT COUNT(*) FROM sqlite_schema WHERE type = 'view') as views;
```

### Application-Specific Queries
```sql
-- Users overview
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN onboarding_completed = 1 THEN 1 END) as completed_onboarding,
  COUNT(DISTINCT jurisdiction) as jurisdictions,
  COUNT(DISTINCT onboarding_current_step) as current_steps
FROM users;

-- Assets overview
SELECT 
  COUNT(*) as total_assets,
  COUNT(DISTINCT exchange) as exchanges,
  COUNT(DISTINCT class) as asset_classes,
  COUNT(CASE WHEN tradable = 1 THEN 1 END) as tradable_assets
FROM assets;

-- Recent users
SELECT uid, email, created_at, onboarding_current_step, jurisdiction
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

## API Reference

### Database Utilities (`database-utils.ts`)

#### `executeQuery(sql: string): Promise<QueryResult>`
Execute any SQL query and return formatted results.

```typescript
const result = await executeQuery('SELECT * FROM users LIMIT 5');
console.log(`Found ${result.rows.length} rows in ${result.executionTime}ms`);
```

#### `getAllTables(): Promise<string[]>`
Get list of all database tables.

```typescript
const tables = await getAllTables();
console.log('Available tables:', tables);
```

#### `getTableInfo(tableName: string): Promise<TableInfo | null>`
Get detailed information about a specific table.

```typescript
const info = await getTableInfo('users');
console.log(`Table has ${info.columns.length} columns and ${info.rowCount} rows`);
```

#### `getDatabaseStats(): Promise<DatabaseStats>`
Get comprehensive database statistics.

```typescript
const stats = await getDatabaseStats();
console.log(`Database has ${stats.totalTables} tables with ${stats.totalRows} total rows`);
```

## Development Workflow

### 1. Database Exploration
1. Open console with `Ctrl+M`
2. Browse tables in the **Tables** tab
3. Click on any table to see schema and sample data
4. Use this information to understand data structure

### 2. Query Development
1. Switch to **Query** tab
2. Use common queries as starting points
3. Modify and execute custom queries
4. Check execution time and optimize as needed

### 3. Performance Monitoring
1. Check **Stats** tab for database overview
2. Monitor table sizes and growth
3. Identify tables that need optimization

### 4. Database Maintenance
1. Use **Admin** tab for maintenance tasks
2. Initialize tables after schema changes
3. Run PRAGMA commands for optimization

## Best Practices

### Security
- **Development Only**: This tool should only be used in development environments
- **No Production Access**: Never expose this console in production builds
- **Query Validation**: Always validate and sanitize user inputs in production code

### Performance
- **Limit Result Sets**: Use LIMIT clauses for large tables
- **Index Usage**: Monitor query execution times and add indexes as needed
- **Regular Maintenance**: Use PRAGMA commands to optimize database performance

### Development
- **Schema Evolution**: Use the console to test schema changes before implementation
- **Data Validation**: Verify data integrity after migrations
- **Query Optimization**: Test and optimize queries before deploying

## Troubleshooting

### Common Issues

1. **Console Won't Open**
   - Check that `Ctrl+M` shortcut isn't conflicting with other tools
   - Verify the component is properly imported and rendered

2. **Database Connection Errors**
   - Verify Turso environment variables are set correctly
   - Check network connectivity to database

3. **Query Execution Failures**
   - Review SQL syntax in the error message
   - Check table and column names for typos
   - Verify permissions for the operation

4. **Performance Issues**
   - Add LIMIT clauses to large queries
   - Check for missing indexes on frequently queried columns
   - Consider pagination for large result sets

### Debug Mode
Add console logging to track query execution:

```typescript
// Enable debug logging
const result = await executeQuery(query);
console.log('Query executed:', { 
  sql: query, 
  rows: result.rows.length, 
  time: result.executionTime 
});
```

## Future Enhancements

### Planned Features
- Query history and favorites
- Export results to CSV/JSON
- Visual query builder
- Database schema visualization
- Real-time query performance monitoring
- Query execution plan analysis

### Contributing
To add new features or improve existing functionality:

1. Update the utility functions in `database-utils.ts`
2. Enhance the UI components in `DatabaseConsoleClient.tsx`
3. Add new queries:
   - Universal queries (work in any SQLite database) → `UNIVERSAL_QUERIES`
   - Project-specific queries (use your table schema) → `PROJECT_QUERIES`
4. Update this documentation with new features

## Query Organization

The common queries are organized into two categories:

### Universal Queries (`UNIVERSAL_QUERIES`)
These work in any SQLite database environment:
- List all tables
- Database info
- Show table schemas
- Show indexes
- Database size info

### Project Queries (`PROJECT_QUERIES`) 
These are specific to the Solace Market schema and can be customized:
- Users overview
- Assets overview  
- Portfolios overview
- Recent users
- Active portfolios
- Onboarding progress
- Exchange distribution

## License
This tool is part of the Solace Market development environment and follows the same licensing terms.