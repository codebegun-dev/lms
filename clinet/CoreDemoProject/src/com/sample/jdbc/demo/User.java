package com.sample.jdbc.demo;
import java.sql.*;

public class User {
    private int userId;
    private Connection con;

    public User(int userId, Connection con) {
        this.userId = userId;
        this.con = con;
    }

    public void checkBalance() {
        try {
            String query = "SELECT balance FROM users WHERE id = ?";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                System.out.println("Your current balance is: ₹" + rs.getDouble("balance"));
            } else {
                System.out.println("User not found.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("Invalid deposit amount.");
            return;
        }

        try {
            String update = "UPDATE users SET balance = balance + ? WHERE id = ?";
            PreparedStatement stmt = con.prepareStatement(update);
            stmt.setDouble(1, amount);
            stmt.setInt(2, userId);
            int rows = stmt.executeUpdate();

            if (rows > 0) {
                System.out.println("Successfully deposited ₹" + amount);
            } else {
                System.out.println("Deposit failed.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            System.out.println("Invalid withdraw amount.");
            return;
        }

        try {
            String query = "SELECT balance FROM users WHERE id = ?";
            PreparedStatement checkStmt = con.prepareStatement(query);
            checkStmt.setInt(1, userId);
            ResultSet rs = checkStmt.executeQuery();

            if (rs.next()) {
                double balance = rs.getDouble("balance");
                if (amount <= balance) {
                    String update = "UPDATE users SET balance = balance - ? WHERE id = ?";
                    PreparedStatement withdrawStmt = con.prepareStatement(update);
                    withdrawStmt.setDouble(1, amount);
                    withdrawStmt.setInt(2, userId);
                    withdrawStmt.executeUpdate();

                    System.out.println("Successfully withdrawn ₹" + amount);
                } else {
                    System.out.println("Insufficient balance.");
                }
            } else {
                System.out.println("User not found.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

