import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import { Fade } from "react-bootstrap"; // optional fade animation

import dayjs from 'dayjs';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress } from '@mui/material';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import PersonIcon from '@mui/icons-material/Person';

import LocationCityIcon from '@mui/icons-material/LocationCity';
//project import
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import SalesLineCardData from 'views/Dashboard/card/sale-chart-1';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { gridSpacing } from 'config.js';

import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import 'react-calendar/dist/Calendar.css';
// import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';

import { CalenderFilter } from 'Middleware/Utils';
import { CalenderFilterEnum } from 'Middleware/Enum';
import { ConfigContext } from 'context/ConfigContext';
import { useNavigate } from 'react-router';
import BatteryChargingFullTwoToneIcon from '@mui/icons-material/BatteryChargingFullTwoTone';
import PowerTwoToneIcon from '@mui/icons-material/PowerTwoTone';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { GetAdminDashboardCount } from '../../../services/dashboard/DashboardApi';

// custom style
const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
  padding: '25px 25px',
  borderLeft: '1px solid' + theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    borderLeft: 'none',
    borderBottom: '1px solid' + theme.palette.background.default
  },
  [theme.breakpoints.down('md')]: {
    borderBottom: '1px solid' + theme.palette.background.default
  }
}));

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const { setLoader, user, companyID } = useContext(ConfigContext);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [dashboardCount, setDashboardCount] = useState([]);

  useEffect(() => {
    DashboardCountData(null, null);
  }, []);

  const handleCalenderFilterChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
    setToDate(null);
    setFromDate(null);
    setShowDateFilters(false);

    let startDate;
    let endDate;

    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        startDate = null;
        endDate = null;
        break;
      case CalenderFilterEnum.This_Week:
        startDate = dayjs().startOf('week');
        endDate = dayjs().endOf('week');

        break;
      case CalenderFilterEnum.Last_Week:
        startDate = dayjs().subtract(1, 'week').startOf('week');
        endDate = dayjs().subtract(1, 'week').endOf('week');
        break;
      case CalenderFilterEnum.This_Month:
        startDate = dayjs().startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case CalenderFilterEnum.Last_Month:
        startDate = dayjs().subtract(1, 'month').startOf('month');
        endDate = dayjs().subtract(1, 'month').endOf('month');
        break;
      case CalenderFilterEnum.This_Quarter:
        startDate = dayjs().startOf('quarter');
        endDate = dayjs().endOf('quarter');
        break;
      case CalenderFilterEnum.Last_Quarter:
        startDate = dayjs().subtract(1, 'quarter').startOf('quarter');
        endDate = dayjs().subtract(1, 'quarter').endOf('quarter');
        break;
      case CalenderFilterEnum.This_6_Months:
        startDate = dayjs().subtract(5, 'months').startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case CalenderFilterEnum.Last_6_Months:
        startDate = dayjs().subtract(11, 'months').startOf('month');
        endDate = dayjs().subtract(6, 'months').endOf('month');
        break;
      case CalenderFilterEnum.This_Year:
        startDate = dayjs().startOf('year');
        endDate = dayjs().endOf('year');
        break;
      case CalenderFilterEnum.Last_Year:
        startDate = dayjs().subtract(1, 'year').startOf('year');
        endDate = dayjs().subtract(1, 'year').endOf('year');
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDateFilters(true);
        return; // Exit the function to avoid calling the API with undefined dates
      default:
        return;
    }
    // Call the API with the calculated date range
    await DashboardCountData(startDate, endDate);
  };

  const handleToDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue);
      setToDate(newToDate);

      if (fromDate && newToDate.isBefore(fromDate)) {
        setFromDate(newToDate.subtract(1, 'day'));
      }
      DashboardCountData(fromDate, newToDate);
    } else {
      setToDate(null);
      DashboardCountData(fromDate, null);
    }
  };

  const handleFromDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const newFromDate = dayjs(newValue);
      setFromDate(newFromDate);

      if (toDate && newFromDate.isAfter(toDate)) {
        setToDate(newFromDate.add(1, 'day'));
      } // Fixed: Pass fromDate first, then toDate to DashboardCountData
      DashboardCountData(newFromDate, toDate);
    } else {
      setFromDate(null);
      DashboardCountData(null, toDate);
    }
  };

  const handleClearDates = () => {
    setFromDate(null);
    setToDate(null);
  };

  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation when mounted
    setTimeout(() => setShow(true), 100);
  }, []);

  const DashboardCountData = async (startDate, endDate, i) => {
    setDashboardCount([]);
    if (startDate !== undefined && endDate !== undefined) {
    }
    setLoader(true);
    try {
      const StartDate = startDate === null ? null : startDate.format('YYYY-MM-DD');
      const EndDate = endDate === null ? null : endDate.format('YYYY-MM-DD');

      const response = await GetAdminDashboardCount({
        pageNo: 0,
        pageSize: 30,
        fromDate: StartDate,
        toDate: EndDate,
        userKeyID: user.userKeyID,
        companyKeyID: companyID
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          if (response?.data?.responseData?.data) {
            const DashboardNumb = response?.data?.responseData?.data;
            setDashboardCount(DashboardNumb);
          }
        } else {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          setErrorMessage(response?.data?.errorMessage);
          setLoader(false);
        }

        return response;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
    }
  };
  const navigate = useNavigate()
  return (
    <Grid container spacing={gridSpacing}>

      <Grid sm={12} item>
        <div
          style={{
            display: 'flex',
            gap: '112px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {' '}
          <div>
            <Select
              options={CalenderFilter}
              value={selectedOption}
              onChange={handleCalenderFilterChange}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '320px',
                  minWidth: '320px'
                })
              }}
            />
          </div>
          {showDateFilters && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                // flexWrap: 'wrap',

              }}
            >
              <DatePicker
                className="date-picker-input text-nowrap  "
                label="From Date"
                value={fromDate ? fromDate.toDate() : null}
                onChange={handleFromDateChange}
                clearIcon={null}
                maxDate={toDate ? dayjs(toDate).toDate() : null}
              />
              {/* DatePicker - To */}
              <DatePicker
                minDate={fromDate ? dayjs(fromDate).toDate() : null}
                className="date-picker-input text-nowrap"
                label="To Date"
                value={toDate ? toDate.toDate() : null}
                onChange={handleToDateChange}
                clearIcon={null}
              />
              <button className="btn btn-primary customBtn" onClick={handleClearDates}>
                Clear
              </button>
            </div>
          )}
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="text-center mt-4">
          <Fade in={show}>
            <h6
              className="fw-bold text-uppercase  "
              style={{
                fontSize: "1.8rem",
                letterSpacing: "1.5px",
                color: "#0d6efd",
                textShadow: "0 0 8px rgba(13, 110, 253, 0.3)",
                display: "inline-block",
                position: "relative",
                transition: "transform 0.3s ease, text-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.textShadow = "0 0 12px rgba(13, 110, 253, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.textShadow = "0 0 8px rgba(13, 110, 253, 0.3)";
              }}
            >
              🏢 Company 1
            </h6>
          </Fade>
        </div>
        <Grid container spacing={gridSpacing}>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={23}
                secondary="Total User"
                color={theme.palette.warning.main}
                footerData="Total User"
                iconPrimary={SupervisedUserCircleIcon}
              // iconFooter={}
              />
            </div>
          </Grid>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={4}
                secondary="Total Project"
                color={theme.palette.error.main}
                footerData="Total Project"
                iconPrimary={AccountTreeIcon}
                iconFooter={TrendingDownIcon}
              />
            </div>
          </Grid>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={3}
                secondary="Total Institute"
                color={theme.palette.info.main}
                footerData="Total Institute"
                iconPrimary={LocationCityIcon}
                iconFooter={TrendingDownIcon}
              />
            </div>
          </Grid>
          <Grid style={{ cursor: 'pointer' }} item lg={3} sm={6} xs={12}>
            <div >
              <ReportCard
                primary={40}
                secondary="Total Employee"
                color={theme.palette.success.main}
                footerData="Total Employee"
                iconPrimary={PersonIcon}
                iconFooter={TrendingDownIcon}
              />
            </div>
          </Grid>




        </Grid>
      </Grid>

    </Grid>
  );
};

export default Default;
