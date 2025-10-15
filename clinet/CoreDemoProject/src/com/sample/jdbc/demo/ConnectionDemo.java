package com.sample.jdbc.demo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class ConnectionDemo {
	public static void main(String[] args) {
		System.out.println("JDBC");
        Connection con = null;

        String url = "jdbc:mysql://127.0.0.1:3306/flipcart";
        String user = "root";
        String pwd = "root";
        String query = "SELECT * FROM Products";
        Statement stmt = null;
        ResultSet results = null;

        try {
            con = DriverManager.getConnection(url, user, pwd);
            stmt = con.createStatement();

            results = stmt.executeQuery(query); 

            while (results.next()) {
                System.out.println("Product Name: " + results.getString("Product_Name"));
                System.out.println("Product Quantity: " + results.getString("Quantity"));
                
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (results != null) results.close();
                if (stmt != null) stmt.close();
                if (con != null) con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }


	}



