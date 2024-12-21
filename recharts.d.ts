declare module 'recharts' {
  import { ReactNode } from 'react';

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }

  export class ResponsiveContainer extends React.Component<ResponsiveContainerProps> {}

  export interface LineChartProps {
    data?: any[];
    margin?: { top: number; right: number; bottom: number; left: number };
    children?: ReactNode;
  }

  export class LineChart extends React.Component<LineChartProps> {}

  export interface LineProps {
    type?: string;
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
    yAxisId?: string;
    name?: string;
    dot?: boolean;
  }

  export class Line extends React.Component<LineProps> {}

  export interface BarChartProps extends LineChartProps {}
  export class BarChart extends React.Component<BarChartProps> {}

  export interface BarProps extends LineProps {
    fill?: string;
  }
  export class Bar extends React.Component<BarProps> {}

  export interface CartesianGridProps {
    strokeDasharray?: string;
  }
  export class CartesianGrid extends React.Component<CartesianGridProps> {}

  export interface XAxisProps {
    dataKey?: string;
    angle?: number;
    textAnchor?: string;
    height?: number;
  }
  export class XAxis extends React.Component<XAxisProps> {}

  export interface YAxisProps {
    yAxisId?: string;
    orientation?: 'left' | 'right';
    stroke?: string;
  }
  export class YAxis extends React.Component<YAxisProps> {}

  export interface TooltipProps {
    content?: ReactNode;
  }
  export class Tooltip extends React.Component<TooltipProps> {}

  export interface LegendProps {
    content?: ReactNode;
  }
  export class Legend extends React.Component<LegendProps> {}
}
