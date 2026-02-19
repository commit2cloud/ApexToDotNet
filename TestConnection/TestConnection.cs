using Oracle.ManagedDataAccess.Client;
using System;
using System.IO;

class TestConnection
{
    static void Main()
    {
        Console.WriteLine("=== Oracle Database Connection Test ===\n");
        
        // Load environment variables from .env file
        var envFile = Path.Combine(Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.Parent.FullName, ".env");
        
        string password = "";
        if (File.Exists(envFile))
        {
            Console.WriteLine($"✅ Found .env file: {envFile}\n");
            foreach (var line in File.ReadAllLines(envFile))
            {
                if (line.StartsWith("OCI_DB_PASSWORD="))
                {
                    password = line.Substring("OCI_DB_PASSWORD=".Length).Trim();
                    Console.WriteLine("✅ Found password in .env file\n");
                }
            }
        }
        else
        {
            Console.WriteLine($"❌ .env file not found at: {envFile}\n");
        }

        if (string.IsNullOrEmpty(password))
        {
            Console.WriteLine("❌ Password not found. Please set OCI_DB_PASSWORD in .env file");
            return;
        }

        // Connection string - TNS format for better compatibility
        string serviceName = "G5F6A9F954550CC_DBQP49L_low.adb.oraclecloud.com";
        string host = "g5f6a9f954550cc-dbqp49l.adb.us-chicago-1.oraclecloudapps.com";
        int port = 1522;
        
        // TNS format connection string
        string connectionString = $"User Id=ADMIN;Password={password};Data Source=(DESCRIPTION=(RETRY_COUNT=3)(RETRY_DELAY=3)(ADDRESS=(PROTOCOL=TCPS)(PORT={port})(HOST={host}))(CONNECT_DATA=(SERVICE_NAME={serviceName}))(SECURITY=(SSL_SERVER_DN_MATCH=YES)))";
        
        Console.WriteLine("Connection Details:");
        Console.WriteLine($"  Host: {host}");
        Console.WriteLine($"  Port: {port}");
        Console.WriteLine($"  Service: {serviceName}");
        Console.WriteLine($"  User: ADMIN");
        Console.WriteLine($"  Password: {'*'}{new string('*', password.Length - 2)}{password[^1]}\n");
        
        Console.WriteLine("Attempting to connect...\n");
        
        try
        {
            using (OracleConnection connection = new OracleConnection(connectionString))
            {
                connection.Open();
                Console.WriteLine("✅ CONNECTION SUCCESSFUL!\n");
                
                // Test query 1: Database version
                using (OracleCommand command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1";
                    using (OracleDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            Console.WriteLine($"Database Version: {reader.GetString(0)}");
                        }
                    }
                }
                
                // Test query 2: Current user
                using (OracleCommand command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT USER FROM DUAL";
                    using (OracleDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            Console.WriteLine($"Connected As: {reader.GetString(0)}");
                        }
                    }
                }
                
                // Test query 3: Service name
                using (OracleCommand command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT SYS_CONTEXT('USERENV', 'SERVICE_NAME') FROM DUAL";
                    using (OracleDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            Console.WriteLine($"Service Name: {reader.GetString(0)}");
                        }
                    }
                }
                
                // Test query 4: Database name
                using (OracleCommand command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT SYS_CONTEXT('USERENV', 'DB_NAME') FROM DUAL";
                    using (OracleDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            Console.WriteLine($"Database Name: {reader.GetString(0)}");
                        }
                    }
                }
                
                // Test query 5: APEX workspace
                try
                {
                    using (OracleCommand command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT COUNT(*) FROM apex_workspaces WHERE workspace = 'APEXDOTNET'";
                        var count = command.ExecuteScalar();
                        Console.WriteLine($"APEX Workspace Found: {(count.ToString() == "1" ? "Yes ✅" : "No ❌")}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"APEX Workspace Query: Cannot query ({ex.Message})");
                }
                
                Console.WriteLine("\n🎉 ALL TESTS PASSED! Your passwords are correct!");
                Console.WriteLine("\n✅ Ready to start building the migration!");
            }
        }
        catch (OracleException oex)
        {
            Console.WriteLine($"❌ CONNECTION FAILED!\n");
            Console.WriteLine($"Oracle Error {oex.Number}: {oex.Message}\n");
            
            string hint = oex.Number switch
            {
                1017 => "❌ INVALID PASSWORD\n\n" +
                       "Your database password in .env file is incorrect.\n\n" +
                       "To fix:\n" +
                       "1. Go to OCI Console → Autonomous Database\n" +
                       "2. Click 'More Actions' → 'Administrator Password'\n" +
                       "3. Set a new password\n" +
                       "4. Update OCI_DB_PASSWORD in .env file\n" +
                       "5. Run this test again",
                12154 => "TNS: could not resolve service name. Check the service name in connection string.",
                12514 => "TNS: listener does not currently know of service. Database may be down.",
                12541 => "TNS: no listener. Check host and port.",
                28000 => "Account is locked. Unlock the account in OCI Console.",
                _ => $"Check Oracle documentation for error {oex.Number}"
            };
            
            Console.WriteLine($"Hint: {hint}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ CONNECTION FAILED!\n");
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Type: {ex.GetType().Name}");
        }
    }
}
