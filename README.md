# WoTB_Pramo_Comparison_3.8-3.9
node.js Script to compare the Premium ammo cost from 3.8 to 3.9 version

# 3rd parties stuff used:
  - xml2js (simply do npm install xml2js) then you can start this script up
  - WG's Old XML data

# What it outputs:
  - In the Console:
      - random logs that are used during development
      - at the end there will be 2 values:
        - the "Overall Discount" indicates the Overall Discount Average for this set of Ammo
        - the "Overall Discount Excluding Zeros" indicates the Overall Discount Average, Excluding all 0 Discount ammunitions.
		- the "Average Percentage" Indicates the Average Discount Percentage for this set of ammo
		- the "Average Percentage Excluding Zeros" Indicates the Average Discount Percentage, Excluding all 0 Discount ammunitions.
  - In the JSON Data:
    - The Per gun value (comparison.js and GoldRoundsComparison.json)
      - Basic Data Structure: 
        - Nation
           - Gun
            - Tanks Using the gun
            - Ammo Name
              - Cost in 3.8
              - Cost in 3.9
              - Percentage Discount
    - The Per Ammmo Value (comparisonByAmmo.js and GoldRoundsComparisonPerAmmo.json)
      - Basic Data Structure:
        - Nation
          - Ammo Name
            - Cost in 3.8
            - Cost in 3.9
            - Percentage Discount
