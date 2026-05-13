import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardBody } from './Card';
import Badge from './Badge';
import AnimatedCounter from '../AnimatedCounter';

export default function KPICard({ title, value, change, icon, color, subtitle, trend, badge }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <div className="flex items-center space-x-2">
            {badge && <Badge variant={badge.variant} size="sm">{badge.text}</Badge>}
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-critical' : 'text-gray-500'}`}>
              {trend === 'up' && <ArrowUp className="h-4 w-4 mr-1" />}
              {trend === 'down' && <ArrowDown className="h-4 w-4 mr-1" />}
              {change}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? <AnimatedCounter target={value} /> : value}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </CardBody>
    </Card>
  );
}
