package com.sample.jdbc.demo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) {
        String url = "jdbc:mysql://127.0.0.1:3306/atmdb";
        String user = "root";
        String password = "root";

        try {
            Connection con = DriverManager.getConnection(url, user, password);

            // You can also ask user2 to enter their ID
            int userId = 1; // for example, hardcoded user ID
            User atmUser = new User(userId, con);

            ATM atm = new ATM(atmUser);
            atm.start();

            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
