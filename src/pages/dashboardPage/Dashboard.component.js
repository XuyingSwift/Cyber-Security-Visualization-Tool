import React from 'react';
import { DashboardGrid, CardGroupWrapper, GroupWrapper, Group } from './Dashboard.styles';
import MainHeader from '../../components/mainHeader/MainHeader.component';
import * as CalendarChartProps from '../../charts/CalendarChartProps';
import * as LineChartProps from '../../charts/LineChartProps';
import * as TableChartProps from '../../charts/TableChartProps';
import RiskCard from '../../components/riskCard/RiskCard.component';
import PiqueChart from '../../charts/PiqueChart.component';
import { createStructuredSelector } from 'reselect';
import { selectProjects, selectQuarters, selectRiskList } from '../../redux/piqueTree/PiqueTree.selector';
import { connect } from 'react-redux';
import ArrowButton from '../../components/arrowButton/ArrowButton.component';
import {IoSkullOutline} from 'react-icons/io5'
import {ImWarning} from 'react-icons/im';
import {RiAlarmWarningLine} from 'react-icons/ri'
import {RiSecurePaymentLine} from 'react-icons/ri'
import {CgDanger} from 'react-icons/cg';


const Dashboard = ({projects, riskList, quarters}) => {
    const riskLevelOptions = [   
        {
            label: 'Severe',
            value: '#cb0032',
            icon: <IoSkullOutline/>
        },
        {
            label: 'High',
            value: '#ff6500',
            icon: <RiAlarmWarningLine/>
        },
        {
            label: 'Elevated',
            value: '#fde101',
            icon: <CgDanger/>
        },
        {
            label: 'Guarded',
            value: '#3566cd',
            icon: <ImWarning/>
        },
        {
            label: 'Low',
            value: '#009a66',
            icon: <RiSecurePaymentLine/>
        }  
]

    // get the bin data from uploajded files
    const getBinData = () => {
        let binData = [];
        binData.push(["version", "score"]);
        projects.map((file, index) => binData.push([`v${file.versionNumber}`, file.fileContent.value]));
        return binData;
    }

    
    const card = riskList.map((file, index) => {
        return (<RiskCard title={file.qaName} score={file.qaValue} color={file.qaColor} icon={file.qaIcon} key={index}/>)
    })

    const riskCard = riskLevelOptions.map((item, index) => {
        return (<RiskCard title={item.label} color={item.value} icon={item.icon}/>)
    })

    console.log("dashboard", projects)

    const getTitle = () => {
        let lineChartTitle = '';
        projects.map((file, index) => lineChartTitle = file.fileContent.name)
        return lineChartTitle;
    }
    const getTableChartOptions = () => {
        let options = {
            title: getTitle(),
            curveType: "function",
            legend: { position: "bottom" },
            allowHtml: true,
            width: '100%', 
            height: '90%',
        }
        return options;
    }
    const getTableChartData = () => {
        let data = [];
        let score = [];
        score.push("Score");
        score = [...score, ...quarters];

        let qFiles = [];
        qFiles = projects.filter(file => file.QuarterNumber != null);
        let TQIS = [];
        TQIS.push("TQI")
        qFiles.map(file => TQIS.push({v:file.fileContent.value}));

        let arr1 = [];
        arr1.push(qFiles[0].fileContent.children[0].name);
        qFiles.map(file => arr1.push({v:file.fileContent.children[0].value}));

        let arr2 = [];
        arr2.push(qFiles[0].fileContent.children[1].name);
        qFiles.map(file => arr1.push({v:file.fileContent.children[1].value}));

        let arr3 = [];
        arr3.push(qFiles[0].fileContent.children[2].name);
        qFiles.map(file => arr1.push({v:file.fileContent.children[2].value}));

        let arr4 = [];
        arr4.push(qFiles[0].fileContent.children[3].name);
        qFiles.map(file => arr1.push({v:file.fileContent.children[3].value}));

        let arr5 = [];
        arr5.push(qFiles[0].fileContent.children[4].name);
        qFiles.map(file => arr1.push({v:file.fileContent.children[4].value}));

        let arr6 = [];
        arr6.push(qFiles[0].fileContent.children[5].name);
        qFiles.map(file => arr1.push({v:file.fileContent.children[5].value}));

        data.push(score, TQIS, arr1, arr2, arr3, arr4, arr5, arr6);

        return data;

    }

    return (
        <DashboardGrid>
            <MainHeader
                width={CalendarChartProps.width}
                height={CalendarChartProps.height}
                data={CalendarChartProps.inputData}
                chartType={CalendarChartProps.chartType}
                options={CalendarChartProps.options}
                showButton={CalendarChartProps.showButton}
            />
            <div>
                <CardGroupWrapper>{riskCard}</CardGroupWrapper>
            </div>
            <div>
                {projects? (<div>
                    <ArrowButton>show projects</ArrowButton>
                    <CardGroupWrapper>
                        {card}
                    </CardGroupWrapper>
                    </div>) : null}
            
            </div>

            <GroupWrapper>
                <Group>
                    <PiqueChart 
                        width={LineChartProps.width}
                        height={LineChartProps.height}
                        data={getBinData()}
                        options={LineChartProps.options}
                        chartType={LineChartProps.chartType}
                        showButton={LineChartProps.showButton}
                    />
                </Group>
                <Group>
                    <PiqueChart
                        width={TableChartProps.width}
                        height={TableChartProps.height}
                        data={getTableChartData()}
                        options={getTableChartOptions()}
                        chartType={TableChartProps.chartType}
                        showButton={TableChartProps.showButton}
                    />
                </Group>
            </GroupWrapper>
        </DashboardGrid>
    )
}

const mapStateToProps = createStructuredSelector({
    projects: selectProjects,
    riskList: selectRiskList,
    quarters: selectQuarters
})

export default connect(mapStateToProps)(Dashboard)