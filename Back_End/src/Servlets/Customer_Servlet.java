package Servlets;

import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/customer")
public class Customer_Servlet extends HttpServlet {

    @Resource(name="java:comp/env/jdbc/pool")
    DataSource ds;
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            ResultSet rst=connection.prepareStatement("Select * from Customer").executeQuery();
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();

            while (rst.next()){
                String id = rst.getString(1);
                String name = rst.getString(2);
                String address = rst.getString(3);
                String contact = rst.getString(4);

                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("id",id);
                objectBuilder.add("name",name);
                objectBuilder.add("address",address);
                objectBuilder.add("contact",contact);

                arrayBuilder.add(objectBuilder.build());
            }
            PrintWriter writer = resp.getWriter();
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status",200);
            response.add("message","Done");
            response.add("data",arrayBuilder.build());

            writer.print(response.build());
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String customerID = req.getParameter("customerNIC");
        String customerName = req.getParameter("customerName");
        String customerAddress = req.getParameter("customerAddress");
        String customerContact = req.getParameter("customerContact");

        PrintWriter writer = resp.getWriter();
        try {
            Connection con = ds.getConnection();
            String query="INSERT INTO Customer VALUES(?,?,?,?)";

            PreparedStatement stm = con.prepareStatement(query);
            stm.setObject(1,customerID);
            stm.setObject(2,customerName);
            stm.setObject(3,customerAddress);
            stm.setObject(4,customerContact);
            boolean b = stm.executeUpdate() > 0;

            if (b){
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_OK);
                response.add("status",200);
                response.add("message","Customer Successfully Added");
                response.add("data","");
                writer.print(response.build());
/*

                writer.print(response.build());
                writer.print("successfully added customer");
*/
            }
            con.close();
        } catch (SQLException throwables) {
            resp.setStatus(HttpServletResponse.SC_OK);
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status",400);
            response.add("message","Error");
            response.add("data",throwables.getLocalizedMessage());
            writer.print(response.build());

            throwables.printStackTrace();
        }
    }
}
