package Servlets;

import javax.annotation.Resource;
import javax.json.*;
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
        resp.setContentType("application/json");
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
            if (b) {
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);//201
                response.add("status", 200);
                response.add("message", "Successfully Added");
                response.add("data", "");
                writer.print(response.build());
            }
            con.close();
        } catch (SQLException throwables) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", throwables.getLocalizedMessage());
            writer.print(response.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
            throwables.printStackTrace();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String customerID = req.getParameter("id");
        PrintWriter writer = resp.getWriter();
        try {
            Connection con = ds.getConnection();
            String query="DELETE FROM Customer WHERE CustomerNIC='" + customerID + "'";
            PreparedStatement stm = con.prepareStatement(query);
            boolean b = stm.executeUpdate() > 0;
            resp.setContentType("application/json");
            if (b){
                JsonObjectBuilder response = Json.createObjectBuilder();
                response.add("status",200);
                response.add("message","Successfully deleted");
                response.add("data","");

                writer.print(response.build());

            }
            con.close();
        } catch (SQLException e) {
            resp.setStatus(200);
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status",500);
            response.add("message","Error");
            response.add("data",e.getLocalizedMessage());

            writer.print(response.build());
            e.printStackTrace();
        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();
        String CustomerNIC = jsonObject.getString("nic");
        String CustomerName = jsonObject.getString("name");
        String CustomerAddress = jsonObject.getString("address");
        String CustomerContact = jsonObject.getString("contact");
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");
        try {
            Connection con = ds.getConnection();
            String query="UPDATE Customer set CustomerNIC=?,CustomerName=?,CustomerAddress=?,CustomerContact=? where CustomerNIC='" +CustomerNIC+"'";

            PreparedStatement stm = con.prepareStatement(query);
            stm.setObject(1,CustomerNIC);
            stm.setObject(2,CustomerName);
            stm.setObject(3,CustomerAddress);
            stm.setObject(4,CustomerContact);
            boolean b1 = stm.executeUpdate() > 0;

            if (b1){
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);
                response.add("status",200);
                response.add("message","updated");
                response.add("data","");

                writer.print(response.build());

            }else{
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);
                response.add("status",400);
                response.add("message","update failed");
                response.add("data","");

                writer.print(response.build());

            }
            con.close();
        } catch (SQLException e) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            resp.setStatus(HttpServletResponse.SC_CREATED);
            response.add("status",500);
            response.add("message","update failed");
            response.add("data",e.getLocalizedMessage());

            writer.print(response.build());
            e.printStackTrace();
        }

    }


}
