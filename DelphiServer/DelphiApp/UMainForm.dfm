object MainForm: TMainForm
  Left = 0
  Top = 0
  Caption = 'Delphi App'
  ClientHeight = 191
  ClientWidth = 366
  Color = clBtnFace
  Constraints.MinHeight = 230
  Constraints.MinWidth = 382
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  DesignSize = (
    366
    191)
  PixelsPerInch = 96
  TextHeight = 13
  object lblSource: TLabel
    Left = 8
    Top = 164
    Width = 37
    Height = 13
    Anchors = [akLeft, akBottom]
    Caption = 'Source:'
  end
  object lblQuote: TLabel
    Left = 8
    Top = 69
    Width = 34
    Height = 13
    Caption = 'Quote:'
  end
  object lblId: TLabel
    Left = 8
    Top = 42
    Width = 14
    Height = 13
    Caption = 'Id:'
  end
  object lblNav: TLabel
    Left = 8
    Top = 14
    Width = 55
    Height = 13
    Caption = 'Navigation:'
  end
  object memQuote: TDBMemo
    Left = 72
    Top = 66
    Width = 280
    Height = 89
    Anchors = [akLeft, akTop, akRight, akBottom]
    DataField = 'quote'
    DataSource = MainModule.dtsQuotes
    TabOrder = 0
  end
  object nvgQuotes: TDBNavigator
    Left = 72
    Top = 8
    Width = 230
    Height = 25
    DataSource = MainModule.dtsQuotes
    TabOrder = 1
  end
  object edtSource: TDBEdit
    Left = 72
    Top = 161
    Width = 280
    Height = 21
    Anchors = [akLeft, akRight, akBottom]
    DataField = 'source'
    DataSource = MainModule.dtsQuotes
    TabOrder = 2
  end
  object edtId: TDBEdit
    Left = 72
    Top = 39
    Width = 280
    Height = 21
    Anchors = [akLeft, akTop, akRight]
    DataField = 'id'
    DataSource = MainModule.dtsQuotes
    ReadOnly = True
    TabOrder = 3
  end
end
