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

@WebServlet(urlPatterns = "/order")
public class Order_Servlet extends HttpServlet {
    @Resource(name="java:comp/env/jdbc/pool")
    DataSource ds;
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
   /*     try {
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
        }*/
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();

        String oID = jsonObject.getString("oID");
        String date = jsonObject.getString("date");
        String custName = jsonObject.getString("custName");
        String totalPrice = jsonObject.getString("totalPrice");
        String cash = jsonObject.getString("cash");
        String discount = jsonObject.getString("discount");

        double tempTotal= Double.parseDouble(totalPrice);
        double tempDis= Double.parseDouble(cash);
        double tempCash= Double.parseDouble(discount);

        System.out.println(tempTotal+" & "+tempDis+" & "+tempCash);

        resp.setContentType("application/json");
        PrintWriter writer = resp.getWriter();

          try {
            Connection con = ds.getConnection();
            String query="INSERT INTO Orders VALUES(?,?,?,?,?,?)";

            PreparedStatement stm = con.prepareStatement(query);
            stm.setObject(1,oID);
            stm.setObject(2,date);
            stm.setObject(3,custName);
            stm.setObject(4,tempTotal);
            stm.setObject(5,tempDis);
            stm.setObject(6,tempCash);
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


}
