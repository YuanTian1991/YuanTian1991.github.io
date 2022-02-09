import { Container } from "@material-ui/core"
import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"

const RevolverMaps = () => (
  <Layout>
    <Container >
    <div id="revolvermap" align="center"  className="wcustomhtml">

            <iframe className="adc" scrolling="no" frameBorder="0" allowtransparency="true" width="50%" height="500px" src="//rf.revolvermaps.com/w/6/a/a2.php?i=5ejvbv5pt7h&amp;m=7&amp;c=e63100&amp;cr1=ffffff&amp;f=arial&amp;l=0&amp;bv=90&amp;lx=-400&amp;ly=400&amp;hi=20&amp;he=7&amp;hc=a8ddff&amp;rs=80"></iframe>
         </div>

    </Container>
  </Layout>
)

export default RevolverMaps
