#! /bin/bash
# this could be more than one line but like no
# requires advanced search search to be completed, then copy the entire table to banweb.txt
grep -v -E "L[0-9]" banweb.txt | grep -v -E "6999|6990|6091|5999|5990|4099" | awk -F "\t" '{print $3 $4 $8 $14}' | uniq -u > classinfo.txt