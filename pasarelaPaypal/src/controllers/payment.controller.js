import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


const { PAYPAL_API_CLIENT, PAYPAL_API_SECRET,PAYPAL_API,HOST,SECRET_KEY } = process.env;


export const createOrder = async (req, res) => {
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "5.00",
          },
        },
      ],
      application_context: {
        brand_name: "TarotLatinoamerica",
        landing_page: "NO_PREFERENCE",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,
        failure_url: `https://cartastarotpanama.com/welcome`,
        cancel_url: `https://cartastarotpanama.com/welcome`,
      },
    };

    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(access_token);

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data);

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something goes wrong");
  }
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

       if (response.data.status === "COMPLETED") {
         const approvalToken = jwt.sign(
           { status: 'approved', timestamp: Date.now() },
           SECRET_KEY,
           { expiresIn: '1m' }
         );
         return res.redirect(`https://numerologiapanama.com/result?status=COMPLETED&token=${approvalToken}`);
       } else {
         const rejectToken = jwt.sign(
           { status: 'not_approved', timestamp: Date.now() },
           SECRET_KEY,
           { expiresIn: '1m' }
         );
         return res.redirect(`https://numerologiapanama.com/result?status=COMPLETED&token=${rejectToken}`);
       }
  } catch (error) {
    if (error.response) {
      console.error('Error de PayPal:', error.response.data);
      // Redirige o responde según el código de error
      if(error.response.status === 422){
        // Ejemplo: redirige a una URL de error definida
        return res.redirect(`https://numerologiapanama.com/result?status=NOT_COMPLETED`);
      }
      return res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error desconocido:', error.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
};

export const cancelPayment = (req, res) => res.redirect("/");


/* 
async function generateAccesToken() {
  const response = await axios({
    url: process.env.PAYPAL_API_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
  });
  return response.data.access_token;
}

export const createOrder = async (req, res) => {
  try {
    const accesToken = await generateAccesToken();
    const response = await axios({
      url: process.env.PAYPAL_API_URL + "/v2/checkout/orders",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accesToken,
      },
      data: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            items: [
              {
                name: "Lectura de cartas tarot",
                description: "Lectura de cartas tarot",
                quantity: "1",
                unit_amount: {
                  currency_code: "USD",
                  value: "15.00",
                },
              },
            ],
            amount: {
              currency_code: "USD",
              value: "15.00",
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: "15.00",
                },
              },
            },
          },
        ],
        application_context: {
          return_url: "http://localhost:3000/descripcion-cartas",
          cancel_url: "http://localhost:3000/welcome",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Tarot Latinoamerica"
        },
      }),
    });
    return res.status(200).json(response.data.links.find(link => link.rel === "approve").href);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};


export const captureOrder = async (req, res) => {
  const { orderID } = req.params;
  if (!orderID) {
    return res.status(400).json({ error: "Missing orderID" });
  }

  try {
    const accessToken = await generateAccesToken();
    const response = await axios({
      url: process.env.PAYPAL_API_URL + `/v2/checkout/orders/${orderID}/capture`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    if (response.data.status === "COMPLETED") {
      return res.status(200).json({ message: "Compra aprobada", data: response.data });
    } else {
      return res.status(200).json({ message: "Compra no aprobada", data: response.data });
    }
  } catch (error) {
    console.error("Error capturing order:", error);
    res.status(500).json({ error: "Failed to capture order" });
  }
}; */