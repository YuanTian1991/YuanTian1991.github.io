import React, { useRef, useEffect, useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container, Grid, Paper, Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  pannel: {
    padding: 0,
    margin: 0,
    height: "calc(100vh - 64px - 16px - 49px - 38px - 31px)",
    listStyle: "none",
    // border: "0.1px solid silver",
    display: "flex",
    flexWrap: "wrap",
    rowGap: "0px",
    alignContent: "flex-start",
  },
  monthBlock_passed: {
    textAlign: "center",
    backgroundColor: "#cfd8dc",
    borderRadius: "2px",
    border: "0px solid lightgrey",
    color: "grey",
    margin: "0px",
    "&:hover": {
      backgroundColor: "rgba(26, 32, 39, 0.7)",
      "-webkit-transition": "background-color 100ms linear",
      "-ms-transition": "background-color 100ms linear",
      transition: "background-color 100ms linear",
      "-webkit-transition": "font-weight 100ms linear",
      "-ms-transition": "font-weight 100ms linear",
      transition: "font-weight 100ms linear",
    },
  },
  monthBlock_future: {
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "2px",
    border: "0px solid lightgrey",
    color: "grey",
    margin: "0px",
    "&:hover": {
      backgroundColor: "rgba(26, 32, 39, 0.7)",
      "-webkit-transition": "background-color 100ms linear",
      "-ms-transition": "background-color 100ms linear",
      transition: "background-color 100ms linear",
      "-webkit-transition": "font-weight 100ms linear",
      "-ms-transition": "font-weight 100ms linear",
      transition: "font-weight 100ms linear",
    },
  },
}))

export default function LifeInMonth(props) {
  const classes = useStyles()
  const pannelRef = useRef(null)
  const [squreLength, setSqureLength] = useState(0)
  const [hoverText, setHoverText] = useState("Make Every Month Count")

  const monthBlocks = Array.from(
    {
      length: 960,
    },
    (v, k) => k + 1
  )

  const currentMonth =
    (new Date().getFullYear() - 1991) * 12 + new Date().getMonth() + 1

  useEffect(() => {
    if (pannelRef.current) {
      let tmpLength = Math.sqrt(
        (pannelRef.current.offsetWidth * pannelRef.current.offsetHeight) / 960
      )
      let A = Math.floor(pannelRef.current.offsetWidth / tmpLength)
      tmpLength = pannelRef.current.offsetWidth / (A + 2)
      setSqureLength(tmpLength)
    }
  }, [pannelRef.current])

  const handleBlockHover = index => {
    let hoverYear = Math.floor(index / 12 + 1991)
    let hoverMonth = index % 12

    if (hoverMonth === 0) {
      hoverYear = hoverYear - 1
      hoverMonth = 12
    }

    setHoverText(hoverYear + " - " + hoverMonth)
  }

  return (
    <Layout>
      <SEO title="Life in Month" />
      {/* <p
        style={{ textAlign: "center", fontSize: "0.75em", marginBottom: "1em" }}
      >
        {" "}
        Life in Month
      </p> */}

      <Container maxWidth={"xl"}>
        <Grid
          container
          // direction="row"
          justifyContent="center"
          // alignItems="center"
        >
          <Grid item xs={12} sm={8} md={6} ref={pannelRef}>
            <p
              style={{ margin: "0px", textAlign: "center", fontSize: "0.85em" }}
            >
              {hoverText}
            </p>
            <ul className={classes.pannel}>
              {monthBlocks.map(m => {
                return (
                  <li
                    style={{
                      margin: "0px",
                      width: squreLength + "px",
                      height: squreLength + "px",
                      // border: "1px solid lightgrey",
                    }}
                  >
                    <Paper
                      elevation={0}
                      className={
                        m <= currentMonth
                          ? classes.monthBlock_passed
                          : classes.monthBlock_future
                      }
                      style={{
                        width: squreLength - 2 + "px",
                        height: squreLength - 2 + "px",
                      }}
                      onMouseOver={() => handleBlockHover(m)}
                      onMouseLeave={() => setHoverText("Make Every Month Count")}
                    ></Paper>
                  </li>
                )
              })}
            </ul>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}
