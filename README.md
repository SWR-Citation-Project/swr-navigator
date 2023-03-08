# Infomap Network Navigator

## TODO

- D3 differences:
    - Network: "d3": "^5.15.1"
    - Dashboard/all else: "d3": "^6.5.0",
- Integrate Multipage approach with summary stats on the homepage
    - Use [weather dashboard](/Users/chrislindgren/Development/dataviz/fullstack-d3-advanced-code/13-using-d3-with-react-js) from Wattenberger's book as template
- Network page should autoload

## Data

- ```public/swr.ftree```
    * Uses this ftree file by default
    * Produced via the following code in this sequence within the [swr-citation]() repository:
        1. ```notebooks/processing/general/1-clean-names-journals-and-output-net-files.ipynb```
        2. ```notebooks/processing/network/2_infomap_analysis.ipynb```

## How to Run

From the root folder, run the following command to start the development server: ```npm run start```

## FTREE FILE ISSUES

- “ and ”
- ‘ and ‘
- "nan Women Farmers""
- "nan "I Get So Mad (igetsomad)"
- "Council of Writing Program Administrators, National Council of Teachers of English, and National Writing Project."
- 21:37 3.57225e-05" Council of Teachers of English" 17733
- " directly next to the flow number, e.g., 3.57225e-05" Lindgren"