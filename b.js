const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const qs = require('qs');
const port = 4400;
const bodyParser = require('body-parser');
app.use(express.json());


const corsOptions = {
    origin: '*', // Allow requests from any origin
    methods: 'POST, GET, OPTIONS, PUT, DELETE', // Allow specified methods
    allowedHeaders: 'Content-Type', // Allow specified headers
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
        try {
            console.log(buf.toString(encoding));
            JSON.parse(buf.toString(encoding)); // This will throw an error if the JSON is invalid
        } catch (e) {
            res.status(400).send({ error: 'Invalid JSON' });
            throw e;
        }
    }
}));


app.post('/algolia', async (req, res) => {
    try {
        // Get the query parameters from the request body or query string
        const searchQuery = req.body.query || req.query.query;
        const page = req.body.page || req.query.page || 0;
        const hitsPerPage = req.body.hitsPerPage || req.query.hitsPerPage || 10;

        // Define the search parameters
        const searchParams = {
            query: searchQuery,
            page: page,
            filters: "",
            attributesToRetrieve: ["company_id"],
            hitsPerPage: hitsPerPage,
            clickAnalytics: true,
            distinct: true
        };

        // Payload to send to Algolia
        const payload = {
            requests: [
                {
                    indexName: "WaaSPublicCompanyJob_production",
                    params: new URLSearchParams(searchParams).toString()
                }
            ]
        };

        console.log('Sending payload to Algolia:', JSON.stringify(payload));

        const response = await axios.post('https://45bwzj1sgc-dsn.algolia.net/1/indexes/*/queries', payload, {
            headers: {
                'x-algolia-agent': 'Algolia for JavaScript (3.35.1); Browser',
                'x-algolia-application-id': '45BWZJ1SGC',
                'x-algolia-api-key': 'ZjY5ZWJjZDY3Y2Q2ZDViNTQ4Yjg2OTNhZWY2Y2Y2MGVhMjY1NWRkZGZhYTdkZjA5MDBkZWMwYTZiODgwOWU3MnRhZ0ZpbHRlcnM9JTVCJTVCJTIyam9ic19hcHBsaWNhbnQlMjIlNUQlNUQmYW5hbHl0aWNzVGFncz0lNUIlMjJ3YWFzJTIyJTVEJnVzZXJUb2tlbj1pNWdXQ3JMbEFsdWFMcjdnUVN3aVpDRWxRWmolMkI5bEU2dTRkSG9pY0V3YWclM0Q=',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'https://www.workatastartup.com',
                'Referer': 'https://www.workatastartup.com/',
                'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
            }
        });

        const data = response.data;
        console.log('Response data from Algolia:', JSON.stringify(data, null, 2));

        // Extract company_id from the response and store them in an array
        const allCompanyIds = data.results[0].hits.map(hit => hit.company_id);
        console.log('All Company IDs:', allCompanyIds);

        // Respond with the data and the array of company IDs
        res.json({  allCompanyIds });

    } catch (error) {
        if (error.response) {
            console.error('Error response from Algolia:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            console.error('No response received from Algolia:', error.request);
            res.status(500).json({ message: 'No response received from Algolia' });
        } else {
            console.error('Error message:', error.message);
            res.status(500).json({ message: error.message });
        }
        console.error('Error config:', error.config);
    }
});


app.post('/fetch-data', async (req, res) => {
    try {

        console.log("req.body.companiesId",req.body)

        const companiesId = req.body.companiesId
        // Payload with the ids
        const payload = {
            ids: companiesId
        };

        console.log('Sending payload:', JSON.stringify(payload));

        const response = await axios.post('https://www.workatastartup.com/companies/fetch', payload, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': 'application/json',
                'Origin': 'https://www.workatastartup.com',
                'Referer': 'https://www.workatastartup.com/companies?demographic=any&hasEquity=any&hasSalary=any&industry=any&interviewProcess=any&jobType=any&layout=list-compact&query=AI&sortBy=keyword&tab=any&usVisaNotRequired=any',
                'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'X-Csrf-Token': 'OgadUxlb0ofRXjoHuV71uatMdXw2GwVKYHu05lpYN3UIq0dKiZ0BhDzaYZJKdM3avwEWQDkXqFHMeXm1PdFLZg',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': '_sso.key=_FjL8COwkwe5PZbgrsQ4GFPfEzKsXkLQ; _bf_session_exists=eyJfcmFpbHMiOnsibWVzc2FnZSI6ImRISjFaUT09IiwiZXhwIjpudWxsLCJwdXIiOiJjb29raWUuX2JmX3Nlc3Npb25fZXhpc3RzIn19--c09bf3da17accf4c53e92f910eef613c6f99527b; _ga=GA1.2.112172488.1717669552; _gid=GA1.2.1606380107.1717669552; _ga_CHJJ1RJL5K=GS1.2.1717677889.2.1.1717678683.60.0.0; amp_e48895=FlCK_qbZX4YEpGDUpYxyz_.MjA4ODYwMA==..1hvmp9524.1hvmq1dsh.v.o.1n; XSRF-TOKEN=uvi5hTWkYSST5cYxPx7AOKNRbHN9rNnO5JK--j_tZB2IVWOcpWKyJ35hnaTMNPhbtxwPT3KgdNVIkHOpWGQYDg; _bf_session_key=W%2B2%2BK%2Fxq9EOXU3NW07zXw9Ak%2B5wyN8TDU%2B3%2F%2FiRRLtYV4EG9OyikTBRaWX%2Be7lO007Y5bpYxZO25Ex0jMsoLgGH1q%2FrGqBAwhWos6i7OkaIwkiTed00cO%2FWSjM3VR3qkNGENh7UcH1ZIqFg97RmhXxPpEh3dEPmbvoCRoTE8Z56DW9Wr7VLpoG6jbC471ZdwHSq9a9wcc2uzZRFIv62lxwYcL0ydLYTftokbdAvo0gNy0aRAKUYJ%2Bt5n%2FBwAseN4gnwTgRkfq1TRly7FJsfiMm3x6YzhWPQ%3D--9M6dbGk%2Bi7VNARyS--vVbmm2b6aY%2BtEd%2Fuw7wtHw%3D%3D; _gali=search'
            }
        });

        const data = response.data;
        console.log('Response data:', JSON.stringify(data, null, 2));

        res.json(data);

    } catch (error) {
        if (error.response) {
            console.error('Error response:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
            res.status(500).json({ message: 'No response received from the server' });
        } else {
            console.error('Error message:', error.message);
            res.status(500).json({ message: error.message });
        }
        console.error('Error config:', error.config);
    }
});


// changes removed 
 



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
