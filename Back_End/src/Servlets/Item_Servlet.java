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

@WebServlet(urlPatterns = "/item")
public class Item_Servlet extends HttpServlet {
    @Resource(name="java:comp/env/jdbc/pool")
    DataSource ds;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            ResultSet rst=connection.prepareStatement("Select * from Item").executeQuery();
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();

            while (rst.next()){
                String code = rst.getString(1);
                String name = rst.getString(2);
                String price = rst.getString(3);
                String qty = rst.getString(4);

                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("code",code);
                objectBuilder.add("name",name);
                objectBuilder.add("price",price);
                objectBuilder.add("qty",qty);

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
        String ItemCode = req.getParameter("ItemCode");
        String ItemName = req.getParameter("ItemName");
        String ItemPrice = req.getParameter("ItemPrice");
        String ItemQty = req.getParameter("ItemQty");
        resp.setContentType("application/json");
        PrintWriter writer = resp.getWriter();
        try {
            Connection con = ds.getConnection();
            String query="INSERT INTO Item VALUES(?,?,?,?)";

            PreparedStatement stm = con.prepareStatement(query);
            stm.setObject(1,ItemCode);
            stm.setObject(2,ItemName);
            stm.setObject(3,ItemPrice);
            stm.setObject(4,ItemQty);
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
        String itemCode = req.getParameter("code");
        PrintWriter writer = resp.getWriter();
        try {
            Connection con = ds.getConnection();
            String query="DELETE FROM Item WHERE ItemCode='" + itemCode + "'";
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
        String itemCode = jsonObject.getString("code");
        String itemName = jsonObject.getString("name");
        String itemPrice = jsonObject.getString("price");
        String itemQty = jsonObject.getString("qty");
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");
        try {
            Connection con = ds.getConnection();
            String query="UPDATE Item set ItemCode=?,ItemName=?,ItemPrice=?,Qty=? where ItemCode='" +itemCode+"'";

            PreparedStatement stm = con.prepareStatement(query);
            stm.setObject(1,itemCode);
            stm.setObject(2,itemName);
            stm.setObject(3,itemPrice);
            stm.setObject(4,itemQty);
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
